"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
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

/**
 * Ensures every Supabase Auth user has a profile row and aligns email / display
 * name from Auth metadata. Does not change roles or staff approval state for
 * existing profiles.
 */
export async function syncProfilesFromAuth(): Promise<{
  inserted?: number;
  updated?: number;
  error?: string;
}> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { error: auth.error };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Server configuration error.",
    };
  }

  let inserted = 0;
  let updated = 0;
  let page = 1;
  const perPage = 200;

  for (;;) {
    const { data: pageData, error: listError } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (listError) {
      return { error: listError.message };
    }
    const users = pageData.users;
    if (users.length === 0) break;

    for (const u of users) {
      const email = (u.email ?? "").trim();
      const meta = u.user_metadata as Record<string, unknown> | undefined;
      const fullName =
        typeof meta?.full_name === "string" ? meta.full_name.trim() : "";
      const staffReq = meta?.staff_signup === true;

      const { data: row, error: fetchErr } = await admin
        .from("profiles")
        .select("id, email, full_name")
        .eq("id", u.id)
        .maybeSingle();

      if (fetchErr) {
        return { error: fetchErr.message };
      }

      if (!row) {
        if (!email) {
          continue;
        }
        const { error: insErr } = await admin.from("profiles").insert({
          id: u.id,
          email,
          full_name: fullName || null,
          role: "client" as UserRole,
          staff_signup_requested: staffReq,
          staff_approval_status: (staffReq ? "pending" : "none") as StaffApprovalStatus,
        });
        if (insErr) {
          return { error: insErr.message };
        }
        inserted += 1;
        continue;
      }

      const patch: { email?: string; full_name?: string | null } = {};
      if (email && email !== row.email) {
        patch.email = email;
      }
      if (fullName && fullName !== (row.full_name ?? "")) {
        patch.full_name = fullName;
      }
      if (Object.keys(patch).length === 0) continue;

      const { error: upErr } = await admin.from("profiles").update(patch).eq("id", u.id);
      if (upErr) {
        return { error: upErr.message };
      }
      updated += 1;
    }

    if (users.length < perPage) break;
    page += 1;
  }

  revalidatePath("/admin");
  return { inserted, updated };
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
