"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StaffApprovalStatus, UserRole } from "@/lib/types";

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
    return { ok: false as const, error: "Only administrators can manage users." };
  }
  return { ok: true as const, supabase, currentUserId: user.id };
}

export type ManagedUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  staff_signup_requested: boolean;
  staff_approval_status: StaffApprovalStatus;
  created_at: string;
  updated_at: string;
};

export type UserListFilters = {
  search?: string;
  role?: UserRole | "all";
  status?: StaffApprovalStatus | "all";
};

export async function listUsers(
  filters: UserListFilters = {},
): Promise<{ data?: ManagedUser[]; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { error: auth.error };
  }

  let query = auth.supabase
    .from("profiles")
    .select(
      "id, email, full_name, role, staff_signup_requested, staff_approval_status, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (filters.role && filters.role !== "all") {
    query = query.eq("role", filters.role);
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("staff_approval_status", filters.status);
  }
  if (filters.search && filters.search.trim().length > 0) {
    const term = filters.search.trim().replace(/[%,]/g, "");
    query = query.or(`email.ilike.%${term}%,full_name.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) {
    return { error: error.message };
  }

  return { data: (data ?? []) as ManagedUser[] };
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { error: auth.error };
  }

  if (userId === auth.currentUserId && role !== "admin") {
    return { error: "You can't demote your own admin account while logged in." };
  }

  const update: {
    role: UserRole;
    staff_approval_status?: StaffApprovalStatus;
  } = { role };

  if (role === "staff") {
    update.staff_approval_status = "approved";
  } else if (role === "admin") {
    update.staff_approval_status = "approved";
  } else {
    update.staff_approval_status = "none";
  }

  const { error } = await auth.supabase.from("profiles").update(update).eq("id", userId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return {};
}
