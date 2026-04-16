import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminOrStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  const isAdminOrStaff = role === "admin" || role === "staff";

  if (!isAdminOrStaff) {
    redirect("/portal");
  }
}

export async function requireClientPortal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/portal");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  const isAdminOrStaff = role === "admin" || role === "staff";

  if (isAdminOrStaff) {
    redirect("/admin");
  }
}
