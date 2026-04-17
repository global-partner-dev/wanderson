// Supabase Edge Function: Stripe webhook receiver.
//
// Verifies Stripe signatures, upserts an `orders` row, and for ecommerce
// purchases triggers Supabase's built-in invitation email so the buyer can
// claim their account. The invitation link in the email goes through
// Supabase's own auth flow (same pipeline as "Confirm signup" / "Reset
// password" emails) and lands the user on `${SITE_URL}/auth/callback`.
//
// Required environment secrets (set with `supabase secrets set ...`):
//   STRIPE_SECRET_KEY          sk_test_... or sk_live_...
//   STRIPE_WEBHOOK_SECRET      whsec_... from the Stripe Dashboard / CLI
//   SUPABASE_URL               auto-populated inside functions runtime
//   SUPABASE_SERVICE_ROLE_KEY  auto-populated inside functions runtime
//   SITE_URL                   https://yourdomain.com (for invitation links)
//
// IMPORTANT: in your Supabase project, add the redirect URL to the allow
// list under Authentication → URL Configuration → Redirect URLs:
//   ${SITE_URL}/auth/callback
//   ${SITE_URL}/auth/callback?next=/reset-password
//
// Subscribed events (configure the same list in the Stripe Dashboard):
//   checkout.session.completed
//   checkout.session.async_payment_succeeded
//   checkout.session.async_payment_failed
//
// Local development:
//   supabase functions serve stripe-webhook --no-verify-jwt --env-file ./.env
//   stripe listen --forward-to http://127.0.0.1:54321/functions/v1/stripe-webhook

// deno-lint-ignore-file no-explicit-any
import Stripe from "https://esm.sh/stripe@18?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

if (!stripeSecret) console.error("STRIPE_SECRET_KEY is not set");
if (!webhookSecret) console.error("STRIPE_WEBHOOK_SECRET is not set");
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
}

const stripe = new Stripe(stripeSecret ?? "", {
  apiVersion: "2026-03-25.dahlia",
  httpClient: Stripe.createFetchHttpClient(),
});

// `supabase.functions` automatically provides Deno.env.get for the service
// role key, so we can write even to RLS-protected tables here.
const supabase = createClient(supabaseUrl ?? "", supabaseServiceKey ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...(init.headers ?? {}) },
  });
}

async function findUserByEmail(email: string) {
  // listUsers does not support an email filter; we paginate and match locally.
  // For projects with > 1 page of users this could be replaced with a
  // dedicated lookup once the Supabase Admin API exposes one.
  const lowered = email.toLowerCase();
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error) {
    console.error("listUsers failed", error.message);
    return null;
  }
  return (
    data.users.find((u: any) => (u.email ?? "").toLowerCase() === lowered) ??
    null
  );
}

async function findProductIdBySlug(slug: string | undefined | null) {
  if (!slug) return null;
  const { data } = await supabase
    .from("products")
    .select("id, category")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

async function upsertOrderFromSession(session: any) {
  const meta = (session.metadata ?? {}) as Record<string, string>;
  const productSlug = meta.product_slug ?? null;
  const productId = meta.product_id ?? null;
  const category = (meta.category ?? "translation") as string;
  const userIdFromMeta = meta.user_id && meta.user_id.length > 0 ? meta.user_id : null;
  const fullNameFromMeta = meta.full_name && meta.full_name.length > 0 ? meta.full_name : null;

  const email: string | null =
    session.customer_details?.email ?? session.customer_email ?? null;
  const customerName: string | null =
    session.customer_details?.name ?? fullNameFromMeta ?? null;

  if (!email) {
    console.warn("No email on checkout session; skipping order insert", session.id);
    return null;
  }

  let resolvedProductId = productId;
  if (!resolvedProductId && productSlug) {
    const row = await findProductIdBySlug(productSlug);
    resolvedProductId = row?.id ?? null;
  }

  const paidNow = session.payment_status === "paid";
  const row = {
    user_id: userIdFromMeta,
    product_id: resolvedProductId,
    category,
    status: paidNow ? "paid" : "pending",
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: (session.payment_intent as string | null) ?? null,
    stripe_customer_id: (session.customer as string | null) ?? null,
    customer_email: email.toLowerCase(),
    customer_name: customerName,
    amount_total_cents: session.amount_total ?? null,
    currency: (session.currency as string | null) ?? "brl",
    payment_method_types: session.payment_method_types ?? null,
    metadata: meta as Record<string, unknown>,
    paid_at: paidNow ? new Date().toISOString() : null,
  };

  // Upsert keyed on the Stripe session id so retried webhooks are idempotent.
  const { data: order, error } = await supabase
    .from("orders")
    .upsert(row, { onConflict: "stripe_checkout_session_id" })
    .select("id, status")
    .single();

  if (error) {
    console.error("orders upsert failed", error.message);
    return null;
  }

  // If the paying user already has an auth account, link it so RLS gives them access.
  if (!row.user_id) {
    const hit = await findUserByEmail(email);
    if (hit?.id) {
      await supabase.from("orders").update({ user_id: hit.id }).eq("id", order.id);
    }
  }

  return order;
}

async function logInvitation(
  orderId: string,
  email: string,
  fullName: string | null,
) {
  // Records the fact we asked Supabase to send an invite. Used by the admin
  // panel so staff can see who has an outstanding invitation. The token
  // column is required (unique not-null) but is no longer used to claim
  // accounts — Supabase's own auth token in the email is what authenticates.
  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("order_id", orderId)
    .is("claimed_at", null)
    .order("created_at", { ascending: false })
    .maybeSingle();
  if (existing?.id) return;

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
  const { error } = await supabase.from("invitations").insert({
    token: crypto.randomUUID(),
    order_id: orderId,
    email: email.toLowerCase(),
    full_name: fullName,
    expires_at: expires,
  });
  if (error) console.error("invitations insert failed", error.message);
}

async function sendSupabaseInvitation(
  email: string,
  fullName: string | null,
  orderId: string,
) {
  // Use Supabase's own invitation pipeline so the email is sent through the
  // project's configured SMTP (or the built-in dev mailer for testing).
  // After the buyer clicks the link, the auth gateway exchanges the token,
  // /auth/callback creates a session, and they land on /reset-password to
  // pick a password before entering /portal.
  const redirectTo = `${siteUrl}/auth/callback?next=/reset-password`;

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: {
      full_name: fullName ?? "",
      source: "ecommerce_order",
      order_id: orderId,
    },
  });
  if (error) {
    console.error(
      `inviteUserByEmail failed for ${email}:`,
      error.message,
    );
    return null;
  }
  console.log(
    `invitation email queued for ${email} (user=${data.user?.id}, order=${orderId})`,
  );
  return data.user;
}

async function handleCheckoutCompleted(session: any) {
  const order = await upsertOrderFromSession(session);
  if (!order) return;

  // Re-fetch so we observe any user_id that upsertOrderFromSession may have linked.
  const { data: refreshed } = await supabase
    .from("orders")
    .select("id, user_id, customer_email, customer_name, status")
    .eq("id", order.id)
    .single();
  if (!refreshed) return;
  if (refreshed.status !== "paid") return;
  if (refreshed.user_id) return; // existing account already attached

  const email = ((refreshed.customer_email as string) ?? "").toLowerCase();
  if (!email) return;
  const fullName = (refreshed.customer_name as string | null) ?? null;

  const invited = await sendSupabaseInvitation(
    email,
    fullName,
    refreshed.id as string,
  );

  if (invited?.id) {
    // Link the order to the freshly-created auth user immediately so the
    // client portal sees the purchase as soon as they sign in.
    await supabase
      .from("orders")
      .update({ user_id: invited.id })
      .eq("id", refreshed.id as string);
  }

  await logInvitation(refreshed.id as string, email, fullName);
}

async function markSessionFailed(session: any) {
  await supabase
    .from("orders")
    .update({ status: "failed" })
    .eq("stripe_checkout_session_id", session.id);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return json({ error: "missing stripe-signature" }, { status: 400 });
  if (!webhookSecret) return json({ error: "server not configured" }, { status: 500 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("webhook signature verification failed", message);
    return json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        await handleCheckoutCompleted(event.data.object);
        break;
      }
      case "checkout.session.async_payment_failed": {
        await markSessionFailed(event.data.object);
        break;
      }
      default:
        // Ignore everything else for now; add more handlers when subscriptions arrive.
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("webhook handler error", event.type, message);
    return json({ error: "handler error" }, { status: 500 });
  }

  return json({ received: true });
});
