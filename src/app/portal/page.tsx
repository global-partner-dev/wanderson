import Link from "next/link";
import ClientPortal from "@/components/portal/ClientPortal";

export const metadata = {
  title: "Client portal · Polonia4u",
  description: "Interactive dashboard, timeline, and vault (demo).",
};

export default function PortalPage() {
  return (
    <div className="portal-shell relative min-h-screen overflow-x-hidden text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[#f8f9fc]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,hsl(222_100%_64%/0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,hsl(252_90%_65%/0.04),transparent_50%)]" />
        <div className="portal-noise absolute inset-0 opacity-[0.025]" />
      </div>
      <ClientPortal />
      <footer className="mt-auto border-t border-black/[0.04] bg-white/60 py-6 text-center text-[13px] tracking-[-0.01em] text-[#8a8f98] backdrop-blur-sm">
        <Link href="/" className="font-medium text-[#6c727f] transition-colors hover:text-foreground">
          ← Marketing site
        </Link>
        <span className="mx-3 text-black/10">|</span>
        <span>Demo only - authenticated CSR shell in production</span>
      </footer>
    </div>
  );
}
