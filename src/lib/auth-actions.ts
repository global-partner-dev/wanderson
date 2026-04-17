"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unexpected error. Please try again." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch failed during login:", profileError.message);
  }

  const role = profile?.role;

  return {
    redirect: role === "admin" || role === "staff" ? "/admin" : "/portal",
  };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("name") as string;

  const staffSignup = formData.get("staff") === "on";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, staff_signup: staffSignup },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (staffSignup) {
    return {
      success:
        "Check your email to confirm your account. An administrator must approve your staff access before you can use the backoffice.",
    };
  }

  return { success: "Check your email to confirm your account." };
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "If an account with that email exists, a password reset link has been sent." };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const fullNameRaw = formData.get("full_name");
  const fullName =
    typeof fullNameRaw === "string" ? fullNameRaw.trim() : "";

  // Update password (and optionally full name) on the auth user.
  const { data: updated, error } = await supabase.auth.updateUser({
    password,
    data: fullName.length > 0 ? { full_name: fullName } : undefined,
  });
  if (error) {
    return { error: error.message };
  }

  // Mirror full_name into the profiles row so the rest of the app sees it.
  if (fullName.length > 0 && updated.user?.id) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", updated.user.id);
    if (profileError) {
      console.error("profile full_name update failed:", profileError.message);
    }
  }

  return { success: "Account updated successfully." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
