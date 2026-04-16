import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin backoffice - Polonia4u",
  description: "Administrative backoffice for Polonia4u",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
