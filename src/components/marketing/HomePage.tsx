"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Home,
  LayoutDashboard,
  Menu,
  Shield,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#acquisition", label: "Acquisition" },
  { href: "#features", label: "Features" },
  { href: "#cta", label: "Get started" },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stats = [
    { value: "200+", label: "Cases tracked", icon: Home, className: "text-primary" },
    { value: "500+", label: "Happy clients", icon: Users, className: "text-success" },
    { value: "15+", label: "Years combined", icon: Shield, className: "text-warning" },
    { value: "20+", label: "Team workflows", icon: Globe, className: "text-info" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Navbar — floating pill, matches refer landing */}
      <nav className="fixed inset-x-0 top-2 z-50 flex justify-center px-2.5 sm:px-3 sm:top-3">
        <div
          className={`flex h-11 w-full max-w-6xl items-center justify-between rounded-2xl px-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 sm:h-12 md:rounded-full md:px-5 ${
            scrolled
              ? "border border-border bg-background/90"
              : "border border-primary-foreground/20 bg-primary-foreground/15"
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <span
              className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              Polonia4u<span className={scrolled ? "text-primary" : "text-amber-300"}>.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 text-sm font-medium md:flex">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-1.5 transition-colors ${
                  scrolled
                    ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/login"
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                scrolled
                  ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="gradient-primary rounded-full border-0 px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm"
            >
              Sign up
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors md:hidden ${
              scrolled
                ? "text-foreground hover:bg-accent"
                : "text-primary-foreground hover:bg-primary-foreground/10"
            }`}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed left-3 right-3 top-[4.1rem] z-40 md:hidden">
          <div className="rounded-xl border border-border/70 bg-background/95 p-3 shadow-xl backdrop-blur-xl">
            <div className="grid gap-1">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <Link
                  href="/login"
                  className="rounded-lg border border-border bg-card py-2.5 text-center text-sm font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="gradient-primary rounded-lg py-2.5 text-center text-sm font-semibold text-primary-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative flex min-h-[100svh] items-center pb-10 pt-20 sm:pb-12 sm:pt-24">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(220_28%_12%)_0%,hsl(222_40%_24%)_40%,hsl(252_32%_26%)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/88 via-foreground/55 to-transparent" />
            <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-info/20 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground backdrop-blur-sm">
                Citizenship &amp; document services
              </div>
              <h1 className="mb-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                Your path to Polish citizenship,
                <br />
                <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                  organized end to end
                </span>
              </h1>
              <p className="mb-7 max-w-lg text-sm leading-relaxed text-primary-foreground/75 sm:text-lg">
                European citizenship workflows for teams: headless architecture, Supabase RLS, Stripe Billing, e-sign, CRM,
                and a client portal — GDPR / LGPD aligned.
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  href="/signup"
                  className="gradient-primary inline-flex h-11 items-center justify-center gap-2 rounded-full border-0 px-6 text-base font-semibold text-primary-foreground shadow-md"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/triage"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-6 text-base font-semibold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20"
                >
                  Try triage wizard
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-primary-foreground/15 bg-transparent px-6 text-base font-semibold text-primary-foreground/90 hover:bg-primary-foreground/10"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform architecture — links to demo routes */}
      <section id="platform" className="border-b border-border bg-background py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <span className="mb-2 inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Headless stack
            </span>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">Public SEO, private CSR</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Next.js SSR for marketing and compliance pages; authenticated client portal as a SPA-style experience. API
              and workers in Node + TypeScript; PostgreSQL with Row Level Security (e.g. Supabase).
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/triage", title: "Triage wizard", desc: "Anonymous steps; PII only at the end; no partial storage." },
              { href: "/portal", title: "Client portal", desc: "Timeline, vault, billing states — demo shell." },
              { href: "/proposal/demo-uuid-0001", title: "Secure proposal", desc: "Expiry countdown, satellite signers, BRL checkout." },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:card-shadow-hover sm:p-6"
              >
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
                  Open demo <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Acquisition */}
      <section id="acquisition" className="bg-muted/50 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">A) Direct e-commerce</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Product landing → Stripe Checkout → user creation → client portal. Standalone SKUs (translation,
                research) skip the triage wizard.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  Stripe Billing · Pix, boleto, card in BRL
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  Webhooks for reconciliation and ERP (e.g. Conta Azul)
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">B) Triage wizard</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                JSON-driven eligibility engine. No CPF/RG during anonymous steps; CRM receives only completed, qualified
                leads. Retention: exit-intent + Meta/WhatsApp bots feeding the same pipeline.
              </p>
              <Link
                href="/triage"
                className="gradient-primary mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm"
              >
                Launch wizard demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-background py-6 sm:py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2.5 px-4 sm:grid-cols-4 sm:gap-4 sm:px-6 lg:px-8 md:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:card-shadow-hover sm:gap-3 sm:p-4 md:p-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted sm:h-11 sm:w-11">
                <s.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${s.className}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-extrabold leading-none text-foreground sm:text-2xl lg:text-3xl">{s.value}</p>
                <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px] sm:mt-1">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/50 py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <span className="mb-2 inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Why Polonia4u
            </span>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">Everything your firm needs</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              CRM with Kanban and table views, family &quot;satellite&quot; contracts, finance with grace and hard-lock
              billing states — aligned with how citizenship teams actually work.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {[
              {
                title: "Sales & CRM",
                desc: "Kanban + table, secure proposal links, e-sign and Stripe handoff.",
                icon: TrendingUp,
              },
              {
                title: "Operations",
                desc: "Citizenship cases, document search, translation, and USC workflows.",
                icon: Users,
              },
              {
                title: "Finance",
                desc: "Categorized revenue views to match how your firm actually works.",
                icon: Shield,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="h-full rounded-xl border border-border bg-card p-5 text-center transition-all duration-300 hover:card-shadow-hover sm:p-6"
              >
                <div className="gradient-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14">
                  <item.icon className="h-6 w-6 text-primary-foreground sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground sm:text-lg">{item.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="gradient-primary relative overflow-hidden rounded-2xl p-8 text-center sm:rounded-3xl sm:p-10 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-2 border-primary-foreground" />
              <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full border-2 border-primary-foreground" />
            </div>
            <div className="relative z-10">
              <LayoutDashboard className="mx-auto mb-4 h-12 w-12 text-primary-foreground/90" />
              <h2 className="mb-2 text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">Ready to try the dashboard?</h2>
              <p className="mx-auto mb-6 max-w-xl text-sm text-primary-foreground/85 sm:text-lg">
                Frontend-only demo: CRM Kanban, finance labels, triage wizard, client portal, and proposal link flows.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-full bg-primary-foreground px-8 py-3 text-sm font-semibold text-primary shadow-sm hover:bg-primary-foreground/90 sm:text-base"
                >
                  Open admin (demo)
                </Link>
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center rounded-full border border-primary-foreground/30 bg-transparent px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 sm:text-base"
                >
                  Client portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact teaser */}
      <section id="contact" className="border-t border-border bg-background py-10">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Team member?</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Open the backoffice for CRM Kanban or the client portal demo to see both sides of the journey.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/admin" className="inline-flex font-semibold text-primary hover:underline">
              Admin backoffice →
            </Link>
            <span className="hidden text-muted-foreground sm:inline">·</span>
            <Link href="/portal" className="inline-flex font-semibold text-primary hover:underline">
              Client portal →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer — refer-style dark sidebar tone */}
      <footer className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 border-t border-sidebar-border pt-8 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-sidebar-accent-foreground">
                Polonia4u<span className="text-primary">.</span>
              </span>
            </div>
            <p className="text-center text-xs text-sidebar-muted sm:text-left">
              © {new Date().getFullYear()} Polonia4u. Demo interface.
            </p>
            <div className="flex gap-4 text-xs text-sidebar-muted">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Demo data only
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
