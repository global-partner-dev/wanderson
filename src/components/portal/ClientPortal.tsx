"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Circle,
  CreditCard,
  Lock,
  Shield,
} from "lucide-react";
type BillingMode = "ok" | "grace" | "suspended";

const TIMELINE = [
  { id: "s1", label: "Intake & KYC", done: true },
  { id: "s2", label: "Document audit", done: true },
  { id: "s3", label: "Sworn translations", done: false },
  { id: "s4", label: "Consular / EU filing", done: false },
];

export default function ClientPortal() {
  const [billing, setBilling] = useState<BillingMode>("grace");

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        {billing === "grace" && (
          <div className="border-b border-warning/30 bg-warning/15 px-4 py-2.5 text-center text-sm font-semibold text-warning-foreground">
            Payment overdue (grace period) — your case stays active.{" "}
            <button type="button" className="underline underline-offset-2">
              Pay now (Pix / boleto / card)
            </button>
          </div>
        )}
        {billing === "suspended" && (
          <div className="border-b border-destructive/30 bg-destructive/15 px-4 py-2.5 text-center text-sm font-semibold text-destructive">
            Account suspended — downloads are disabled until the balance is cleared.
          </div>
        )}
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-bold tracking-tight">
            Polonia4u<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">Billing demo:</span>
            <select
              value={billing}
              onChange={(e) => setBilling(e.target.value as BillingMode)}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-semibold"
            >
              <option value="ok">Current</option>
              <option value="grace">pending_payment (grace)</option>
              <option value="suspended">suspended (30+ days)</option>
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Client portal</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, Silvana</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              CSR shell with timeline and bidirectional vault. Production: Supabase Storage with RLS — every object scoped
              by <code className="rounded bg-muted px-1 py-0.5 text-xs">user_id</code>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
              <Shield className="h-3.5 w-3.5 text-success" aria-hidden />
              LGPD-ready flows
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
              <CreditCard className="h-3.5 w-3.5 text-primary" aria-hidden />
              BRL · entry + 11 installments
            </span>
          </div>
        </div>

        {billing === "suspended" ? (
          <div className="rounded-2xl border-2 border-destructive/40 bg-card p-8 text-center shadow-sm">
            <Lock className="mx-auto h-12 w-12 text-destructive" aria-hidden />
            <h2 className="mt-4 text-xl font-bold">Restricted access</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Only billing actions are available until your subscription is brought current. Vault uploads and EU
              certificate downloads remain revoked for this account state.
            </p>
            <button type="button" className="gradient-primary mt-6 rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm">
              Pay outstanding balance
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-bold">Process timeline</h2>
              <p className="text-sm text-muted-foreground">Driven by <code className="text-xs">status_id</code> in production.</p>
              <ol className="mt-6 space-y-4">
                {TIMELINE.map((step, i) => (
                  <li key={step.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {step.done ? (
                        <CheckCircle2 className="h-6 w-6 text-success" aria-hidden />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground/40" aria-hidden />
                      )}
                      {i < TIMELINE.length - 1 ? (
                        <span className="mt-1 h-full min-h-[1.25rem] w-px bg-border" aria-hidden />
                      ) : null}
                    </div>
                    <div className="pb-2">
                      <p className="font-semibold text-foreground">{step.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.done ? "Completed" : "Waiting on prerequisites or payment window"}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-bold">Vault</h2>
              <p className="text-sm text-muted-foreground">Upload BR docs · download EU certificates from your team.</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-dashed border-primary/35 bg-primary/5 px-3 py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <ArrowUpFromLine className="h-4 w-4" aria-hidden />
                    Upload
                  </span>
                  <button type="button" className="text-xs font-bold text-primary hover:underline">
                    Choose files
                  </button>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs font-bold uppercase text-muted-foreground">From your advisor</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">Certidão_traduzida.pdf</span>
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-primary hover:underline"
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
