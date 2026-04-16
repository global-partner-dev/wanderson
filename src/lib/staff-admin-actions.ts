"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false as const, error: "Not signed in." };
  }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return { ok: false as const, error: "Only administrators can manage staff signup requests." };
  }
  return { ok: true as const, supabase };
}

export type PendingStaffRow = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export async function getPendingStaffRequests(): Promise<{
  data?: PendingStaffRow[];
  error?: string;
}> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { error: auth.error };
  }

  const { data, error } = await auth.supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .eq("staff_approval_status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data: data ?? [] };
}

export async function approveStaffSignup(userId: string): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { error: auth.error };
  }

  const { error } = await auth.supabase
    .from("profiles")
    .update({
      role: "staff",
      staff_approval_status: "approved",
    })
    .eq("id", userId)
    .eq("staff_approval_status", "pending");

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return {};
}

export async function rejectStaffSignup(userId: string): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { error: auth.error };
  }

  const { error } = await auth.supabase
    .from("profiles")
    .update({
      staff_approval_status: "rejected",
    })
    .eq("id", userId)
    .eq("staff_approval_status", "pending");

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return {};
}
