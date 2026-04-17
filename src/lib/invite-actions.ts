"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ClaimResult =
  | { ok: true; redirect: string }
  | { ok: false; error: string };

export async function claimInvitation(formData: FormData): Promise<ClaimResult> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!token) return { ok: false, error: "Missing invitation token." };
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { ok: false, error: "Passwords do not match." };
  }

  const admin = createAdminClient();

  const { data: invites, error: fetchError } = await admin
    .from("invitations")
    .select("id, token, email, full_name, expires_at, claimed_at, order_id")
    .eq("token", token)
    .limit(1);

  if (fetchError) return { ok: false, error: fetchError.message };
  const invite = invites?.[0];
  if (!invite) return { ok: false, error: "Invitation not found." };
  if (invite.claimed_at) return { ok: false, error: "This invitation has already been used." };
  if (new Date(invite.expires_at as string) < new Date()) {
    return { ok: false, error: "This invitation has expired. Please contact support." };
  }

  const email = String(invite.email).toLowerCase();

  const { data: list, error: listErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listErr) return { ok: false, error: listErr.message };
  const existing = list.users.find((u) => (u.email ?? "").toLowerCase() === email);

  let userId: string;
  if (existing) {
    const { error: updErr } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || (invite.full_name as string | null) || existing.user_metadata?.full_name,
      },
    });
    if (updErr) return { ok: false, error: updErr.message };
    userId = existing.id;
  } else {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || (invite.full_name as string | null) || "",
      },
    });
    if (createErr) return { ok: false, error: createErr.message };
    userId = created.user.id;
  }

  await admin
    .from("invitations")
    .update({ claimed_at: new Date().toISOString(), claimed_by: userId })
    .eq("id", invite.id as string);

  await admin
    .from("orders")
    .update({ user_id: userId })
    .eq("id", invite.order_id as string);

  // Sign the user in with the password they just set (same browser session).
  const supabase = await createClient();
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInErr) {
    return {
      ok: true,
      redirect: `/login?status=invite_claimed&email=${encodeURIComponent(email)}`,
    };
  }

  return { ok: true, redirect: "/portal" };
}
