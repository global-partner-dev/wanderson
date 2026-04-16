import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import ProposalClient from "@/components/marketing/ProposalClient";

type Props = { params: Promise<{ uuid: string }> };

export async function generateMetadata({ params }: Props) {
  const { uuid } = await params;
  return {
    title: `Proposal · ${uuid.slice(0, 8)}…`,
    description: "Secure proposal link with expiration (demo).",
  };
}

export default async function ProposalPage({ params }: Props) {
  const { uuid } = await params;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <BrandLogo href="/" size="sm" />
          <span className="text-xs text-muted-foreground">Secure proposal</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <ProposalClient proposalId={uuid} />
      </main>
    </div>
  );
}
