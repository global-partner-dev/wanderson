import { NextResponse } from "next/server";
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

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const dest = next ?? (await resolveRedirect(supabase, "/portal"));
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as "recovery" | "email" });
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      const dest = next ?? (await resolveRedirect(supabase, "/portal"));
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
