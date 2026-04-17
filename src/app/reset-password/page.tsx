import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Set new password - Polonia4u",
  description: "Choose a new password for your Polonia4u account",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialFullName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    const profileName = (profile?.full_name as string | null) ?? "";
    const metaName = (user.user_metadata?.full_name as string | null) ?? "";
    const candidate = (profileName || metaName).trim();
    // Skip obviously placeholder values like "1" that came from the BuyBox
    // so the buyer is prompted to enter a real name.
    initialFullName = candidate.length >= 2 ? candidate : "";
  }

  return <ResetPasswordForm initialFullName={initialFullName} />;
}
