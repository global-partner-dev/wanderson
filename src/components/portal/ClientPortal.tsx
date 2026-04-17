"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpFromLine,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  FolderOpen,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  Receipt,
  Shield,
  TrendingUp,
  Upload,
  Wallet,
} from "lucide-react";
import Link from "next/link";
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

type BillingMode = "ok" | "grace" | "suspended";

const STEPS = [
  { id: 1, label: "Intake & KYC",       sub: "Identity verified",    done: true,  active: false },
  { id: 2, label: "Document audit",     sub: "All docs accepted",    done: true,  active: false },
  { id: 3, label: "Sworn translations", sub: "In progress",          done: false, active: true  },
  { id: 4, label: "Consular filing",    sub: "Pending",              done: false, active: false },
];

const VAULT_FILES = [
  { name: "Certidão_traduzida.pdf", size: "2.4 MB", date: "Apr 12, 2026", from: "advisor" as const },
  { name: "Passaporte_scan.pdf",    size: "1.1 MB", date: "Apr 10, 2026", from: "you"     as const },
  { name: "RG_frente_verso.jpg",    size: "890 KB", date: "Apr 8, 2026",  from: "you"     as const },
];

const TRANSACTIONS = [
  { date: "Apr 1, 2026", amount: "R$ 1.200", label: "Installment" },
  { date: "Mar 1, 2026", amount: "R$ 1.200", label: "Installment" },
  { date: "Feb 1, 2026", amount: "R$ 3.500", label: "Entry fee"   },
];

const NAV = [
  { id: "overview"   as const, label: "Overview",  icon: LayoutDashboard },
  { id: "documents"  as const, label: "Documents", icon: FolderOpen      },
  { id: "billing"    as const, label: "Billing",   icon: Wallet          },
];

/* ── Datta Able–style stat card ─────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconGradient,
  decoColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  iconGradient: string;
  decoColor: string;
}) {
  return (
    <div className="portal-card group relative overflow-hidden rounded-xl border border-border bg-card p-5 card-shadow transition-shadow duration-200 hover:card-shadow-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-2.5 text-[2rem] font-bold leading-none tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{sub}</p>
        </div>
        {/* Gradient icon circle */}
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-md",
            iconGradient,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {/* Decorative translucent bubble */}
      <div
        className={cn(
          "pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full opacity-[0.08]",
          decoColor,
        )}
      />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function ClientPortal() {
  const [billing, setBilling]     = useState<BillingMode>("grace");
  const [navActive, setNavActive] = useState<(typeof NAV)[number]["id"]>("overview");
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, startLogout] = useTransition();

  function handleLogout() {
    startLogout(async () => {
      await signOut();
      router.refresh();
      router.push("/login");
    });
  }

  const completedSteps = STEPS.filter((s) => s.done).length;
  const progressPct    = Math.round((completedSteps / STEPS.length) * 100);

  return (
    /* Full-height flex row — sidebar never scrolls the page */
    <div className="flex h-full">

      {/* ══ Sidebar ══════════════════════════════════════════════════ */}
      <aside className="hidden h-full w-[260px] shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar md:flex">
        {/* Logo */}
        <div className="flex h-[60px] shrink-0 items-center border-b border-sidebar-border px-5">
          <BrandLogo
            href="/"
            size="sm"
            className="brightness-0 invert opacity-90"
            linkClassName="hover:opacity-100"
          />
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col p-4 pt-5" aria-label="Client portal">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-sidebar-muted">
            Main Menu
          </p>
          <div className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active = navActive === item.id;
              const Icon   = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setNavActive(item.id)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary/[0.13] text-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {/* Left accent bar */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0",
                      active ? "text-primary" : "opacity-60",
                    )}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-sidebar-muted">
              Account
            </p>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
            >
              <Home className="h-[18px] w-[18px] shrink-0 opacity-60" />
              Marketing site
            </Link>
          </div>
        </nav>

        {/* ── User profile + logout ── */}
        {user && (
          <div className="shrink-0 border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                {(profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase()}
              </div>
              {/* Name + email */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-none text-sidebar-accent-foreground">
                  {profile?.full_name ?? "User"}
                </p>
                <p className="mt-1 truncate text-[11px] text-sidebar-muted">
                  {user.email}
                </p>
              </div>
              {/* Logout icon button */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Log out"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-muted transition-colors hover:bg-sidebar-accent/60 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ══ Content column ═══════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* ── Notification banners (shrink-0 so they don't scroll) ── */}
        {billing === "grace" && (
          <div className="shrink-0 border-b border-amber-200/80 bg-amber-50">
            <div className="flex flex-col items-center justify-between gap-2 px-4 py-2.5 sm:flex-row sm:px-6">
              <span className="flex items-center gap-2 text-xs font-semibold text-amber-950">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                </span>
                Payment overdue — grace period active
              </span>
              <Button
                type="button"
                size="sm"
                className="h-8 rounded-md bg-amber-900 px-4 text-xs font-semibold text-white hover:bg-amber-950"
              >
                Resolve payment
              </Button>
            </div>
          </div>
        )}
        {billing === "suspended" && (
          <div className="shrink-0 border-b border-red-200/80 bg-red-50">
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-950 sm:px-6">
              <Lock className="h-3.5 w-3.5 text-red-600" />
              Account suspended — downloads disabled until balance cleared
            </div>
          </div>
        )}
        {profile?.staff_approval_status === "pending" && (
          <div className="shrink-0 border-b border-border bg-muted/40">
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-foreground sm:px-6">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Clock className="h-3.5 w-3.5 text-primary" />
              </span>
              Staff access pending — an administrator must approve your registration before you can open the backoffice.
            </div>
          </div>
        )}
        {profile?.staff_approval_status === "rejected" && profile?.staff_signup_requested && (
          <div className="shrink-0 border-b border-border bg-muted/30">
            <div className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground sm:px-6">
              Your request for staff access was not approved. Contact your admin if this was a mistake.
            </div>
          </div>
        )}

        {/* ── Top header (sticky inside column) ─────────────────── */}
        <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 shadow-[0_1px_4px_rgba(32,40,45,0.07)] sm:px-6">
          {/* Mobile: brand logo */}
          <div className="flex min-w-0 items-center gap-3 md:hidden">
            <BrandLogo href="/" size="sm" />
          </div>
          {/* Desktop: breadcrumb */}
          <div className="hidden min-w-0 items-center gap-1.5 md:flex">
            <span className="text-[11px] text-muted-foreground">Home</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
            <span className="text-[11px] font-semibold text-foreground">Dashboard</span>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Demo billing switcher */}
            <div className="hidden items-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/30 px-2 py-1 sm:flex">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Demo
              </span>
              <Select value={billing} onValueChange={(v) => setBilling(v as BillingMode)}>
                <SelectTrigger className="h-7 w-[9.5rem] border-0 bg-transparent px-1 text-[11px] font-semibold text-muted-foreground shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ok"        className="text-xs">Current</SelectItem>
                  <SelectItem value="grace"     className="text-xs">Grace period</SelectItem>
                  <SelectItem value="suspended" className="text-xs">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bell */}
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
            </button>

            <UserMenu />
          </div>
        </header>

        {/* ── Mobile nav tabs ────────────────────────────────────── */}
        <div className="flex shrink-0 border-b border-border bg-card px-2 py-1.5 md:hidden">
          <div className="flex w-full gap-1">
            {NAV.map((item) => {
              const active = navActive === item.id;
              const Icon   = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setNavActive(item.id)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ Scrollable main content ═══════════════════════════════ */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">

            {/* Page heading */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                Welcome back, {profile?.full_name ?? "there"} 👋
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Here&apos;s the latest on your European citizenship process.
              </p>
            </div>

            {/* ── Suspended state ──────────────────────────────────── */}
            {billing === "suspended" ? (
              <div className="relative overflow-hidden rounded-xl border border-border bg-card p-14 text-center card-shadow">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <Lock className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                  Account restricted
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Vault access and document downloads are unavailable until the outstanding balance is cleared.
                </p>
                <Button
                  type="button"
                  className="mt-7 h-11 rounded-lg px-8 text-sm font-semibold"
                  variant="default"
                >
                  Pay outstanding balance
                </Button>
              </div>
            ) : (
              <>
                {/* ── Stat cards ─────────────────────────────────── */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    icon={TrendingUp}
                    label="Case Progress"
                    value={`${progressPct}%`}
                    sub={`${completedSteps} of ${STEPS.length} steps complete`}
                    iconGradient="bg-gradient-to-br from-[hsl(222_100%_64%)] to-[hsl(252_90%_65%)]"
                    decoColor="bg-primary"
                  />
                  <StatCard
                    icon={FolderOpen}
                    label="Documents"
                    value={`${VAULT_FILES.length}`}
                    sub="2 uploaded · 1 from advisor"
                    iconGradient="bg-gradient-to-br from-violet-500 to-purple-600"
                    decoColor="bg-violet-500"
                  />
                  <StatCard
                    icon={CalendarDays}
                    label="Next Payment"
                    value="R$ 1.200"
                    sub="Due May 15, 2026"
                    iconGradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                    decoColor="bg-emerald-500"
                  />
                  <StatCard
                    icon={Shield}
                    label="Case Status"
                    value="Active"
                    sub="LGPD compliant workspace"
                    iconGradient="bg-gradient-to-br from-amber-400 to-orange-500"
                    decoColor="bg-amber-400"
                  />
                </div>

                {/* ── Process timeline card ───────────────────────── */}
                <div className="portal-card mb-6 overflow-hidden rounded-xl border border-border bg-card card-shadow">
                  {/* Card header */}
                  <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-foreground">
                        Process Timeline
                      </h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Your citizenship journey, step by step
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                      </span>
                      {progressPct}% complete
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* Progress bar */}
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(252_90%_65%)] transition-all duration-700"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* ── Horizontal stepper (lg+) ─────────────────── */}
                    <div className="relative mt-8 hidden lg:block">
                      {/* Background connector */}
                      <div
                        className="absolute top-5 h-px bg-border"
                        style={{ left: "calc(12.5%)", right: "calc(12.5%)" }}
                      />
                      {/* Progress fill */}
                      <div
                        className="absolute top-5 h-px bg-gradient-to-r from-primary to-[hsl(252_90%_65%)] transition-all duration-700"
                        style={{
                          left:  "calc(12.5%)",
                          width: `calc(${progressPct} / 100 * 75%)`,
                        }}
                      />
                      <div className="grid grid-cols-4">
                        {STEPS.map((step) => (
                          <div key={step.id} className="flex flex-col items-center gap-3 px-3">
                            <span
                              className={cn(
                                "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ring-4 ring-card",
                                step.done || step.active
                                  ? "bg-gradient-to-br from-primary to-[hsl(252_90%_65%)] text-white shadow-md"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {step.done ? <Check className="h-4 w-4" strokeWidth={3} /> : step.id}
                            </span>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-foreground">{step.label}</p>
                              <p
                                className={cn(
                                  "mt-0.5 text-xs",
                                  step.done
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-muted-foreground",
                                )}
                              >
                                {step.sub}
                              </p>
                              {step.active && (
                                <span className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                  In Progress
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Card grid (mobile / md) ───────────────────── */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
                      {STEPS.map((step) => (
                        <div
                          key={step.id}
                          className={cn(
                            "rounded-xl border p-4 transition-colors",
                            step.done
                              ? "border-border bg-muted/20"
                              : step.active
                                ? "border-primary/30 bg-primary/[0.05]"
                                : "border-border bg-card",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                                step.done || step.active
                                  ? "bg-primary text-white"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {step.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : step.id}
                            </span>
                            {step.active && (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                Active
                              </span>
                            )}
                            {step.done && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                Done
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-sm font-semibold text-foreground">{step.label}</p>
                          <p
                            className={cn(
                              "mt-0.5 text-xs",
                              step.done
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-muted-foreground",
                            )}
                          >
                            {step.sub}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Bottom row: Vault + Billing ─────────────────── */}
                <div className="grid gap-6 lg:grid-cols-12">

                  {/* Document vault */}
                  <div className="portal-card overflow-hidden rounded-xl border border-border bg-card card-shadow lg:col-span-7">
                    <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                      <div>
                        <h2 className="text-base font-bold tracking-tight text-foreground">
                          Document Vault
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Upload BR docs · download EU certificates
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="h-9 gap-2 rounded-lg text-xs font-semibold"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload file
                      </Button>
                    </div>

                    <div className="p-5 sm:p-6">
                      {/* Drop zone */}
                      <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 px-5 py-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.02]">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <ArrowUpFromLine className="h-5 w-5 text-primary" />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-foreground">
                          Drag &amp; drop files here
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          or{" "}
                          <span className="cursor-pointer font-semibold text-primary hover:underline">
                            browse files
                          </span>
                          {" "}— PDF, JPG, PNG up to 25 MB
                        </p>
                      </div>

                      {/* File list */}
                      <div className="mt-5">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                            Recent Files
                          </p>
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            View all <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-border">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-border bg-muted/40">
                                <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                  File
                                </th>
                                <th className="hidden px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground sm:table-cell">
                                  Size
                                </th>
                                <th className="hidden px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground md:table-cell">
                                  Date
                                </th>
                                <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {VAULT_FILES.map((file) => (
                                <tr
                                  key={file.name}
                                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                                >
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={cn(
                                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                          file.from === "advisor"
                                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                            : "bg-muted text-muted-foreground",
                                        )}
                                      >
                                        {file.from === "advisor" ? (
                                          <FileCheck2 className="h-4 w-4" />
                                        ) : (
                                          <FileText className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground sm:hidden">
                                          {file.size} · {file.date}
                                        </p>
                                        {file.from === "advisor" && (
                                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                            From advisor
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                                    {file.size}
                                  </td>
                                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                                    {file.date}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
                                    >
                                      <ArrowDownToLine className="h-3.5 w-3.5" />
                                      <span className="hidden sm:inline">Download</span>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing card */}
                  <div className="portal-card flex flex-col overflow-hidden rounded-xl border border-border bg-card card-shadow lg:col-span-5">
                    <div className="border-b border-border p-5 sm:p-6">
                      <h2 className="text-base font-bold tracking-tight text-foreground">Billing</h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Subscription and payment history
                      </p>
                    </div>

                    {/* Plan card */}
                    <div className="p-5 sm:px-6">
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(222_60%_22%)] to-[hsl(252_55%_30%)] p-5 text-white shadow-lg">
                        {/* Decorative circles */}
                        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/[0.06]" />
                        <div className="pointer-events-none absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-white/[0.06]" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white/55">Current plan</span>
                            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                              Active
                            </span>
                          </div>
                          <p className="mt-3 text-3xl font-bold tabular-nums">
                            R$ 1.200
                            <span className="text-base font-normal text-white/40">/mo</span>
                          </p>
                          <p className="mt-1 text-xs text-white/50">
                            Entry + 11 monthly installments · BRL
                          </p>
                          <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5">
                            <CreditCard className="h-4 w-4 text-white/50" />
                            <span className="text-xs text-white/80">•••• 4242</span>
                            <span className="ml-auto text-[10px] font-medium text-white/40">Visa</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transactions */}
                    <div className="flex-1 px-5 pb-4 sm:px-6">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Recent Transactions
                      </p>
                      <div className="space-y-1">
                        {TRANSACTIONS.map((tx) => (
                          <div
                            key={tx.date}
                            className="flex items-center justify-between gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/40"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Receipt className="h-4 w-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground">{tx.label}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-bold tabular-nums text-foreground">
                                {tx.amount}
                              </p>
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                Paid
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next payment footer */}
                    <div className="shrink-0 border-t border-border px-5 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Next payment</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">May 15, 2026</span>
                      </div>
                    </div>
                  </div>

                </div>{/* /bottom row */}
              </>
            )}
          </div>{/* /max-w-6xl */}

          {/* Footer inside scroll area */}
          <footer className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Marketing site
            </Link>
            <span className="mx-3 text-border">|</span>
            <span>Demo only — authenticated CSR shell in production</span>
          </footer>
        </main>

      </div>{/* /content column */}
    </div>
  );
}
