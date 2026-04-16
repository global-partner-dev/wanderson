"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Users } from "lucide-react";

/** Demo: 120h expiry from first paint */
const EXPIRY_MS = 120 * 60 * 60 * 1000;

function formatRemaining(ms: number) {
  if (ms <= 0) return "0:00:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function ProposalClient({ proposalId }: { proposalId: string }) {
  const [left, setLeft] = useState(EXPIRY_MS);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const elapsed = Date.now() - start;
      setLeft(Math.max(0, EXPIRY_MS - elapsed));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const shortId = useMemo(() => proposalId.slice(0, 8), [proposalId]);

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Family contract engine</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Proposal #{shortId}…</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Primary lead enters CPF/RG and address here. Adult relatives are invited by name, email, and WhatsApp
              only; each party gets an independent contract and Stripe Checkout — activation does not block on other
              family payments.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-warning">
            <Clock className="h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide">Link expires in</p>
              <p className="font-mono text-lg font-bold tabular-nums">{formatRemaining(left)}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-bold uppercase text-muted-foreground">
            Full name
            <input className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" placeholder="Primary applicant" />
          </label>
          <label className="block text-xs font-bold uppercase text-muted-foreground">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-xs font-bold uppercase text-muted-foreground">
            CPF
            <input className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" placeholder="000.000.000-00" />
          </label>
          <label className="block text-xs font-bold uppercase text-muted-foreground">
            RG
            <input className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-bold uppercase text-muted-foreground sm:col-span-2">
            Address (LGPD — minimized in logs)
            <input className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" />
          </label>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Users className="h-4 w-4 text-primary" aria-hidden />
            Satellite signers (adults)
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Add siblings or other adults — we only collect name, email, and WhatsApp at this stage. They receive unique
            links after you submit.
          </p>
          <button type="button" className="mt-3 w-full rounded-xl border border-dashed border-primary/40 bg-primary/5 py-3 text-sm font-semibold text-primary hover:bg-primary/10">
            + Add adult relative
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold">
            Save draft (demo)
          </button>
          <button type="button" className="gradient-primary rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm">
            Sign &amp; pay (e-sign + Stripe)
          </button>
        </div>
      </div>
    </div>
  );
}
