import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  let body: { slug?: string; email?: string; full_name?: string };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid JSON body.");
  }

  const slug = body.slug?.trim();
  if (!slug) return bad("Missing product slug.");

  const email = body.email?.trim().toLowerCase();
  const fullName = body.full_name?.trim();

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) return bad(`Product lookup failed: ${error.message}`, 500);
  if (!product) return bad("Product not found.", 404);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const finalEmail = (user?.email ?? email ?? "").trim().toLowerCase();
  if (!finalEmail) return bad("Email is required.");

  const stripe = getStripe();

  if (!product.stripe_price_id && !product.amount_brl_cents) {
    return bad("Product is missing a price.", 500);
  }

  const lineItem = product.stripe_price_id
    ? { price: product.stripe_price_id as string, quantity: 1 }
    : {
        price_data: {
          currency: (product.currency ?? "brl") as string,
          product_data: {
            name: product.name as string,
            description: (product.description ?? undefined) as string | undefined,
            metadata: {
              product_slug: product.slug as string,
              product_id: product.id as string,
              category: product.category as string,
            },
          },
          unit_amount: (product.amount_brl_cents ?? 0) as number,
        },
        quantity: 1,
      };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      customer_email: user ? undefined : finalEmail,
      customer: undefined,
      client_reference_id: user?.id,
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/checkout/cancel?slug=${encodeURIComponent(product.slug)}`,
      allow_promotion_codes: true,
      metadata: {
        product_id: product.id,
        product_slug: product.slug,
        category: product.category,
        full_name: fullName ?? "",
        source: "ecommerce",
        user_id: user?.id ?? "",
      },
      payment_intent_data: {
        metadata: {
          product_id: product.id,
          product_slug: product.slug,
          category: product.category,
        },
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Stripe error";
    return bad(`Stripe error: ${message}`, 500);
  }

  if (!session.url) return bad("Stripe did not return a Checkout URL.", 500);

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
