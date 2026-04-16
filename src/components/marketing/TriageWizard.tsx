"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Line of descent", subtitle: "Which ancestor connects you to Poland?" },
  { id: 2, title: "Documents", subtitle: "What do you already have?" },
  { id: 3, title: "Contact", subtitle: "Only now — we do not store partial submissions" },
] as const;

export default function TriageWizard() {
  const [step, setStep] = useState(1);
  const [line, setLine] = useState<string | null>(null);
  const [docs, setDocs] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const canNext =
    step === 1
      ? Boolean(line)
      : step === 2
        ? Boolean(docs)
        : Boolean(name.trim() && email.trim() && whatsapp.trim());

  const submit = () => {
    setStep(4);
  };

  if (step === 4) {
    return (
      <div className="mt-8 rounded-2xl border border-success/30 bg-success/10 p-6 text-center sm:p-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
        <h2 className="mt-4 text-xl font-bold text-foreground">Lead captured (demo)</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          In production, this step would create the user, push a hot lead to the CRM, and skip any partial data
          retention — matching your acquisition rules.
        </p>
        <a
          href="/admin"
          className="gradient-primary mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
        >
          View CRM pipeline
        </a>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-4 w-4 text-primary" aria-hidden />
        <span>No CPF/RG in this phase · JSON-driven rules on the server in production</span>
      </div>

      <ol className="mb-8 flex gap-2">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex min-w-0 flex-1 flex-col gap-1">
            <div
              className={cn(
                "h-1.5 rounded-full transition",
                step >= s.id ? "gradient-primary" : "bg-muted",
              )}
            />
            <span className={cn("truncate text-[10px] font-bold uppercase", step >= s.id ? "text-foreground" : "text-muted-foreground")}>
              {i + 1}. {s.title}
            </span>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">{STEPS[0].title}</h2>
          <p className="text-sm text-muted-foreground">{STEPS[0].subtitle}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {["Paternal line", "Maternal line", "Unsure", "Adoption / special case"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setLine(opt)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
                  line === opt
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background hover:bg-muted/60",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">{STEPS[1].title}</h2>
          <p className="text-sm text-muted-foreground">{STEPS[1].subtitle}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "Civil records in Brazil",
              "Polish vital records located",
              "Naturalization papers",
              "Starting from zero",
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setDocs(opt)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
                  docs === opt
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background hover:bg-muted/60",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">{STEPS[2].title}</h2>
          <p className="text-sm text-muted-foreground">{STEPS[2].subtitle}</p>
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase text-muted-foreground">
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-medium"
                placeholder="As on your ID"
                autoComplete="name"
              />
            </label>
            <label className="block text-xs font-bold uppercase text-muted-foreground">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-medium"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label className="block text-xs font-bold uppercase text-muted-foreground">
              WhatsApp
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-medium"
                placeholder="+55 …"
                autoComplete="tel"
              />
            </label>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        {step < 3 ? (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="gradient-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canNext}
            onClick={submit}
            className="gradient-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit to CRM
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
