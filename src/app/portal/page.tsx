import Link from "next/link";
import ClientPortal from "@/components/portal/ClientPortal";

export const metadata = {
  title: "Client portal · Polonia4u",
  description: "Interactive dashboard, timeline, and vault (demo).",
};

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <ClientPortal />
      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted-foreground">
        <Link href="/" className="font-medium text-primary hover:underline">
          ← Marketing site
        </Link>
        <span className="mx-2">·</span>
        <span>Demo only — authenticated CSR shell in production</span>
      </footer>
    </div>
  );
}
