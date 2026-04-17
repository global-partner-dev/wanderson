import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ProfileGuardRow = {
  role: string | null;
  staff_signup_requested: boolean | null;
  staff_approval_status: "none" | "pending" | "approved" | "rejected" | null;
};

async function loadGuardProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null as ProfileGuardRow | null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, staff_signup_requested, staff_approval_status")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile: (profile ?? null) as ProfileGuardRow | null };
}

// A staff signup request that has not been approved (pending or rejected) must
// not be allowed to use any backoffice or client panel. We sign the user out
// and send them back to /login with a status flag so the form can explain.
async function rejectIfStaffNotApproved(profile: ProfileGuardRow | null) {
  if (!profile?.staff_signup_requested) return;
  const status = profile.staff_approval_status;
  if (status === "approved") return;

  const supabase = await createClient();
  await supabase.auth.signOut();

  if (status === "rejected") {
    redirect("/login?status=staff_rejected");
  }
  redirect("/login?status=staff_pending");
}

export async function requireAdminOrStaff() {
  const { user, profile } = await loadGuardProfile();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  await rejectIfStaffNotApproved(profile);

  const role = profile?.role;
  const isAdminOrStaff = role === "admin" || role === "staff";

  if (!isAdminOrStaff) {
    redirect("/portal");
  }
}

export async function requireClientPortal() {
  const { user, profile } = await loadGuardProfile();

  if (!user) {
    redirect("/login?redirect=/portal");
  }

  await rejectIfStaffNotApproved(profile);

  const role = profile?.role;
  const isAdminOrStaff = role === "admin" || role === "staff";

  if (isAdminOrStaff) {
    redirect("/admin");
  }
}
