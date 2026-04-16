import type { Metadata } from "next";
import { requireAdminOrStaff } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Admin backoffice - Polonia4u",
  description: "Administrative backoffice for Polonia4u",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminOrStaff();
  return children;
}
