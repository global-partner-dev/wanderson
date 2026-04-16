export type UserRole = "admin" | "staff" | "client";

export type StaffApprovalStatus = "none" | "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  staff_signup_requested?: boolean;
  staff_approval_status?: StaffApprovalStatus;
  created_at: string;
  updated_at: string;
}
