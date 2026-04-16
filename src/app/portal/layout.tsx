import { requireClientPortal } from "@/lib/auth-guard";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireClientPortal();
  return children;
}
