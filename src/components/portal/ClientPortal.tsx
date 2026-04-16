"use client";

import { Outfit } from "next/font/google";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  FolderOpen,
  Lock,
  Receipt,
  Shield,
  TrendingUp,
  Upload,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

type BillingMode = "ok" | "grace" | "suspended";

const STEPS = [
  { id: 1, label: "Intake & KYC", sub: "Identity verified", done: true },
  { id: 2, label: "Document audit", sub: "All docs accepted", done: true },
  { id: 3, label: "Sworn translations", sub: "In progress", done: false, active: true },
  { id: 4, label: "Consular filing", sub: "Pending", done: false },
];

const VAULT_FILES = [
  { name: "Certidão_traduzida.pdf", size: "2.4 MB", date: "Apr 12, 2026", from: "advisor" as const },
  { name: "Passaporte_scan.pdf", size: "1.1 MB", date: "Apr 10, 2026", from: "you" as const },
  { name: "RG_frente_verso.jpg", size: "890 KB", date: "Apr 8, 2026", from: "you" as const },
];

function PortalCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "portal-card relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-shadow duration-300 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <PortalCard className="group flex items-start gap-4">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", accent)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[#6c727f]">{label}</p>
        <p className={cn(outfit.className, "mt-0.5 text-[1.375rem] font-semibold leading-tight tracking-tight text-[#1a1d23]")}>
          {value}
        </p>
        <p className="mt-1 text-[12px] text-[#9ca1ab]">{sub}</p>
      </div>
    </PortalCard>
  );
}

export default function ClientPortal() {
  const [billing, setBilling] = useState<BillingMode>("grace");
  const { profile } = useAuth();

  const completedSteps = STEPS.filter((s) => s.done).length;
  const progressPct = Math.round((completedSteps / STEPS.length) * 100);

  return (
    <div className={cn(outfit.variable)}>
      {/* ── Grace / Suspended banners ── */}
      {billing === "grace" && (
        <div className="relative overflow-hidden border-b border-amber-200/60 bg-gradient-to-r from-amber-50/90 via-amber-50/80 to-orange-50/60">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-3 sm:flex-row sm:gap-4">
            <span className="flex items-center gap-2.5 text-[13px] font-semibold text-amber-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              </span>
              Payment overdue - grace period active
            </span>
            <Button
              type="button"
              size="sm"
              className="h-8 rounded-lg bg-amber-900 px-4 text-[12px] font-semibold text-white shadow-sm hover:bg-amber-950"
            >
              Resolve payment
            </Button>
          </div>
        </div>
      )}
      {billing === "suspended" && (
        <div className="border-b border-red-200/60 bg-gradient-to-r from-red-50 to-rose-50/80">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2.5 px-6 py-3 text-[13px] font-semibold text-red-900">
            <Lock className="h-3.5 w-3.5 text-red-500" />
            Account suspended - downloads disabled until balance cleared
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-black/[0.04] bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <BrandLogo href="/" size="sm" />
            <nav className="hidden items-center gap-1 md:flex">
              {["Overview", "Documents", "Billing"].map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors",
                    i === 0
                      ? "bg-black/[0.05] text-[#1a1d23]"
                      : "text-[#6c727f] hover:bg-black/[0.03] hover:text-[#1a1d23]",
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-lg border border-dashed border-black/10 bg-black/[0.02] px-2.5 py-1.5 sm:flex">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b0b5bd]">Demo</span>
              <Select value={billing} onValueChange={(v) => setBilling(v as BillingMode)}>
                <SelectTrigger className="h-6 w-36 border-0 bg-transparent px-1.5 text-[11px] font-semibold text-[#6c727f] shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ok" className="text-xs">Current</SelectItem>
                  <SelectItem value="grace" className="text-xs">Grace period</SelectItem>
                  <SelectItem value="suspended" className="text-xs">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        {/* ── Greeting ── */}
        <div className="mb-10">
          <h1
            className={cn(
              outfit.className,
              "text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1a1d23] sm:text-[2rem]",
            )}
          >
            Welcome back, {profile?.full_name ?? "there"}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#6c727f]">
            Here&apos;s the latest on your European citizenship process.
          </p>
        </div>

        {billing === "suspended" ? (
          /* ── Suspended lockout ── */
          <PortalCard className="mx-auto max-w-lg py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <Lock className="h-7 w-7 text-red-500" />
            </div>
            <h2
              className={cn(
                outfit.className,
                "mt-6 text-xl font-semibold tracking-tight text-[#1a1d23]",
              )}
            >
              Account restricted
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#6c727f]">
              Vault access and document downloads are unavailable until the outstanding balance is cleared.
            </p>
            <Button
              type="button"
              className="mt-8 h-11 rounded-xl bg-[#1a1d23] px-8 text-[13px] font-semibold text-white shadow-sm hover:bg-[#2c3039]"
            >
              Pay outstanding balance
            </Button>
          </PortalCard>
        ) : (
          <>
            {/* ── KPI strip ── */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={TrendingUp}
                label="Case progress"
                value={`${progressPct}%`}
                sub={`${completedSteps} of ${STEPS.length} steps`}
                accent="bg-blue-50 text-blue-600"
              />
              <StatCard
                icon={FolderOpen}
                label="Documents"
                value={`${VAULT_FILES.length}`}
                sub="2 uploaded · 1 received"
                accent="bg-violet-50 text-violet-600"
              />
              <StatCard
                icon={CalendarDays}
                label="Next payment"
                value="R$ 1.200"
                sub="Due May 15, 2026"
                accent="bg-emerald-50 text-emerald-600"
              />
              <StatCard
                icon={Shield}
                label="Case status"
                value="Active"
                sub="LGPD compliant"
                accent="bg-amber-50 text-amber-600"
              />
            </div>

            {/* ── Progress stepper ── */}
            <PortalCard className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={cn(outfit.className, "text-[17px] font-semibold tracking-tight text-[#1a1d23]")}>
                    Process timeline
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#9ca1ab]">Your citizenship journey step by step</p>
                </div>
                <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-[12px] font-semibold text-blue-700 sm:inline-flex">
                  {progressPct}% complete
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#f0f1f4]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Steps */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={cn(
                      "group relative rounded-xl border p-4 transition-all duration-200",
                      step.done
                        ? "border-emerald-200/60 bg-emerald-50/40"
                        : step.active
                          ? "border-blue-200 bg-blue-50/30 ring-1 ring-blue-500/20"
                          : "border-black/[0.05] bg-[#fafbfc]",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-bold",
                          step.done
                            ? "bg-emerald-500 text-white"
                            : step.active
                              ? "bg-blue-500 text-white"
                              : "bg-black/[0.06] text-[#9ca1ab]",
                        )}
                      >
                        {step.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.id}
                      </span>
                      {step.active && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                          </span>
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-[#1a1d23]">{step.label}</p>
                    <p className={cn(
                      "mt-0.5 text-[12px]",
                      step.done ? "text-emerald-700" : "text-[#9ca1ab]",
                    )}>
                      {step.sub}
                    </p>
                  </div>
                ))}
              </div>
            </PortalCard>

            {/* ── Vault + Billing row ── */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Vault */}
              <PortalCard className="lg:col-span-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={cn(outfit.className, "text-[17px] font-semibold tracking-tight text-[#1a1d23]")}>
                      Document vault
                    </h2>
                    <p className="mt-0.5 text-[13px] text-[#9ca1ab]">Upload BR docs · download EU certificates</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 rounded-xl border-black/10 text-[12px] font-semibold text-[#1a1d23] hover:bg-black/[0.03]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </Button>
                </div>

                {/* Upload zone */}
                <div className="mt-5 rounded-xl border-2 border-dashed border-black/[0.08] bg-[#fafbfc] px-6 py-5 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/20">
                  <ArrowUpFromLine className="mx-auto h-5 w-5 text-[#b0b5bd]" />
                  <p className="mt-2 text-[13px] font-medium text-[#6c727f]">
                    Drag files here or{" "}
                    <span className="cursor-pointer font-semibold text-blue-600 hover:underline">browse</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#b0b5bd]">PDF, JPG, PNG up to 25 MB</p>
                </div>

                {/* File list */}
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#b0b5bd]">Recent files</p>
                    <button type="button" className="flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:underline">
                      View all <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="divide-y divide-black/[0.04]">
                    {VAULT_FILES.map((file) => (
                      <div key={file.name} className="group/file flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <div className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          file.from === "advisor" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500",
                        )}>
                          {file.from === "advisor" ? (
                            <FileCheck2 className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-[#1a1d23]">{file.name}</p>
                          <p className="text-[11px] text-[#b0b5bd]">
                            {file.size} · {file.date}
                            {file.from === "advisor" && (
                              <span className="ml-1 text-emerald-600"> · From advisor</span>
                            )}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 rounded-lg px-2.5 text-[12px] font-medium text-[#6c727f] opacity-0 transition-opacity group-hover/file:opacity-100"
                        >
                          <ArrowDownToLine className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PortalCard>

              {/* Billing summary */}
              <PortalCard className="flex flex-col lg:col-span-5">
                <div>
                  <h2 className={cn(outfit.className, "text-[17px] font-semibold tracking-tight text-[#1a1d23]")}>
                    Billing
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#9ca1ab]">Subscription and payment history</p>
                </div>

                <div className="mt-5 rounded-xl border border-black/[0.06] bg-gradient-to-br from-[#1a1d23] to-[#2c3039] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-white/60">Current plan</span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                      Active
                    </span>
                  </div>
                  <p className={cn(outfit.className, "mt-2 text-2xl font-semibold tracking-tight")}>
                    R$ 1.200<span className="text-[14px] font-normal text-white/40">/mo</span>
                  </p>
                  <p className="mt-1 text-[12px] text-white/50">Entry + 11 monthly installments · BRL</p>
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/[0.08] px-3 py-2">
                    <CreditCard className="h-4 w-4 text-white/40" />
                    <span className="text-[12px] text-white/70">•••• 4242</span>
                    <span className="ml-auto text-[11px] text-white/40">Visa</span>
                  </div>
                </div>

                <div className="mt-5 flex-1">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[#b0b5bd]">Recent</p>
                  <div className="space-y-3">
                    {[
                      { date: "Apr 1, 2026", amount: "R$ 1.200", status: "paid" as const },
                      { date: "Mar 1, 2026", amount: "R$ 1.200", status: "paid" as const },
                      { date: "Feb 1, 2026", amount: "R$ 3.500", status: "paid" as const, label: "Entry fee" },
                    ].map((tx) => (
                      <div key={tx.date} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f1f4]">
                            <Receipt className="h-3.5 w-3.5 text-[#6c727f]" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#1a1d23]">{tx.label ?? "Installment"}</p>
                            <p className="text-[11px] text-[#b0b5bd]">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[13px] font-semibold text-[#1a1d23]">{tx.amount}</p>
                          <p className="text-[11px] font-medium text-emerald-600">Paid</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-black/[0.05] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#9ca1ab]" />
                      <span className="text-[13px] text-[#6c727f]">Next payment</span>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1a1d23]">May 15, 2026</span>
                  </div>
                </div>
              </PortalCard>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
