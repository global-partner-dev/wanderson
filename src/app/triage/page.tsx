import Link from "next/link";
import TriageWizard from "@/components/marketing/TriageWizard";

export const metadata = {
  title: "Eligibility triage · Polonia4u",
  description: "Anonymous multi-step wizard — contact details only on the final step.",
};

export default function TriagePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-bold tracking-tight">
            Polonia4u<span className="text-primary">.</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Log in
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Triage wizard (demo UI)</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Check eligibility</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Anonymous steps first. Sensitive identifiers (CPF/RG) are not collected here. Name, email, and WhatsApp appear
          only after you finish — the CRM receives a complete lead, not partial drafts.
        </p>
        <TriageWizard />
      </main>
    </div>
  );
}
