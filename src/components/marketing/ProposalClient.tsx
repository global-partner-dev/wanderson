"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
              only. Each party gets an independent contract and Stripe Checkout. Activation does not block on other
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
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Full name</Label>
            <Input className="rounded-xl" placeholder="Primary applicant" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Email</Label>
            <Input type="email" className="rounded-xl" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">CPF</Label>
            <Input className="rounded-xl" placeholder="000.000.000-00" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">RG</Label>
            <Input className="rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Address (LGPD: minimized in logs)</Label>
            <Input className="rounded-xl" />
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Users className="h-4 w-4 text-primary" aria-hidden />
            Satellite signers (adults)
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Add siblings or other adults. We only collect name, email, and WhatsApp at this stage. They receive unique
            links after you submit.
          </p>
          <Button type="button" variant="outline" className="mt-3 w-full rounded-xl border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary/10">
            + Add adult relative
          </Button>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-full px-6">
            Save draft (demo)
          </Button>
          <Button type="button" className="gradient-primary rounded-full border-0 px-8 text-primary-foreground shadow-sm hover:opacity-95">
            Sign and pay (eSign and Stripe)
          </Button>
        </div>
      </div>
    </div>
  );
}
