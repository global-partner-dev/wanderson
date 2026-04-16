import ClientPortal from "@/components/portal/ClientPortal";

export const metadata = {
  title: "Client portal · Polonia4u",
  description: "Interactive dashboard, timeline, and vault (demo).",
};

export default function PortalPage() {
  return (
    <div className="portal-shell h-screen overflow-hidden bg-background text-foreground">
      <ClientPortal />
    </div>
  );
}
