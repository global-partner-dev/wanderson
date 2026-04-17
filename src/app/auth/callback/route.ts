import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

async function resolveRedirect(supabase: Awaited<ReturnType<typeof createClient>>, fallback: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return fallback;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  if (role === "admin" || role === "staff") return "/admin";
  return "/portal";
}

// Supabase email link types that can land here. We accept any of these so
// signup-confirm, password-recovery, magiclink, invite and email-change
// links all flow through this single endpoint.
const ALLOWED_OTP_TYPES: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

function isAllowedOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (ALLOWED_OTP_TYPES as string[]).includes(value);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");
  const next = searchParams.get("next");

  const supabase = await createClient();

  // PKCE flow: ?code=... arrives when the link was started from this same
  // browser (signup, OAuth, magic link triggered from the app).
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const dest = next ?? (await resolveRedirect(supabase, "/portal"));
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  // Token-hash flow: ?token_hash=...&type=... arrives for emails sent
  // server-side (admin invitations, email confirmations whose code_verifier
  // cookie may not be present in this browser). This is the path the
  // Stripe webhook → inviteUserByEmail flow takes.
  if (token_hash && isAllowedOtpType(rawType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: rawType,
    });
    if (!error) {
      // Recovery and invite both want the user to set/replace a password.
      if (rawType === "recovery" || rawType === "invite") {
        return NextResponse.redirect(
          `${origin}${next ?? "/reset-password"}`,
        );
      }
      const dest = next ?? (await resolveRedirect(supabase, "/portal"));
      return NextResponse.redirect(`${origin}${dest}`);
    } else {
      console.error("verifyOtp failed:", error.message, "type:", rawType);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
