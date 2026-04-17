"use client";

import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Home,
  LayoutDashboard,
  MapPin,
  Menu,
  Shield,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SocialNavLinks } from "@/components/marketing/SocialNavLinks";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#acquisition", label: "Acquisition" },
  { href: "#features", label: "Features" },
  { href: "#contact", label: "Contact" },
];

const heroSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hero-serif",
});

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, loading } = useAuth();

  const isLoggedIn = !loading && !!user;
  const dashboardHref = role === "admin" || role === "staff" ? "/admin" : "/portal";
  const dashboardLabel = role === "admin" || role === "staff" ? "Backoffice" : "My portal";

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
    <div className={`min-h-screen bg-background font-sans text-foreground antialiased ${heroSerif.variable}`}>
      <nav className="fixed inset-x-0 top-2 z-50 flex justify-center px-2.5 sm:top-3 sm:px-3">
        <div
          className={`flex h-11 w-full max-w-6xl items-center justify-between rounded-2xl px-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 sm:h-12 sm:px-4 md:rounded-full md:px-5 ${
            scrolled
              ? "border border-border bg-background/90"
              : "border border-primary-foreground/20 bg-primary-foreground/15"
          }`}
        >
          <BrandLogo
            href="/"
            priority
            className={`transition-[filter] duration-300 ${
              scrolled ? "" : "drop-shadow-md brightness-110"
            }`}
          />

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
            {isLoggedIn ? (
              <Button asChild className="gradient-primary rounded-full border-0 px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95">
                <Link href={dashboardHref}>
                  <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                  {dashboardLabel}
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    scrolled
                      ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  }`}
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="gradient-primary rounded-full border-0 px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className={`h-9 w-9 rounded-full md:hidden ${
              scrolled
                ? "text-foreground hover:bg-accent"
                : "text-primary-foreground hover:bg-primary-foreground/10"
            }`}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
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
              <div className="mt-2 border-t border-border pt-3">
                {isLoggedIn ? (
                  <Button asChild className="gradient-primary w-full rounded-lg border-0 text-primary-foreground hover:opacity-95">
                    <Link href={dashboardHref} onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard className="mr-1.5 h-4 w-4" />
                      {dashboardLabel}
                    </Link>
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" className="w-full rounded-lg">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button asChild className="gradient-primary w-full rounded-lg border-0 text-primary-foreground hover:opacity-95">
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden">
        <div className="relative flex min-h-[100svh] items-center justify-center pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroBg}
              alt=""
              fill
              priority
              className="object-cover object-[center_35%] brightness-[1.12] saturate-[1.05]"
              sizes="100vw"
            />
            {/* Lighter overlay so the building stays visible; even vignette for centered type */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-900/28 to-slate-950/50" />
            <div className="absolute inset-0 bg-slate-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_45%,transparent_0%,rgb(15_23_42/0.35)_100%)]" />
            <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-6 inline-flex items-center justify-center rounded-full border border-white/25 bg-black/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200/95 shadow-sm backdrop-blur-md sm:text-[11px] sm:tracking-[0.32em]">
              Citizenship &amp; document services
            </div>
            <h1
              className={`${heroSerif.className} mx-auto mb-6 max-w-4xl text-pretty text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-6xl sm:leading-[1.06] md:text-7xl md:leading-[1.05]`}
            >
              <span className="block">
                Your Path to <span className="text-amber-200">European</span>
              </span>
              <span className="mt-1 block font-semibold sm:mt-1.5">Citizenship</span>
              <span className="mt-4 block font-sans text-2xl font-semibold leading-snug tracking-tight sm:mt-5 sm:text-3xl md:text-[2rem]">
                <span className="bg-gradient-to-r from-violet-200 via-indigo-100 to-sky-200 bg-clip-text text-transparent">
                  Organized End to End
                </span>
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-200/95 sm:text-lg sm:leading-relaxed">
              European citizenship workflows for teams: decoupled architecture, Supabase RLS, Stripe Billing, electronic
              signatures, CRM, and a client portal. GDPR and LGPD aligned.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-3">
              {isLoggedIn ? (
                <Button
                  asChild
                  size="lg"
                  className="gradient-primary h-12 min-w-[10rem] rounded-full border-0 px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-indigo-500/35 hover:opacity-95"
                >
                  <Link href={dashboardHref}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {dashboardLabel}
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="gradient-primary h-12 min-w-[10rem] rounded-full border-0 px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-indigo-500/35 hover:opacity-95"
                  >
                    <Link href="/signup">
                      Get started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="link" size="lg" className="h-12 px-5 text-base font-semibold text-white/95 hover:text-white hover:underline">
                    <Link href="/login">Log in</Link>
                  </Button>
                </>
              )}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 min-w-[10rem] rounded-full border-white/30 bg-black/30 px-8 text-base font-semibold text-white backdrop-blur-md hover:bg-black/45 hover:text-white"
              >
                <Link href="/triage">Try triage wizard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-b border-border bg-background py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <span className="mb-2 inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Platform stack
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
              { href: "/portal", title: "Client portal", desc: "Timeline, vault, billing states (demo shell)." },
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
              <h3 className="text-lg font-bold text-foreground sm:text-xl">A) Direct online sales</h3>
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
              <Button
                asChild
                className="gradient-primary mt-6 inline-flex gap-2 rounded-full border-0 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
              >
                <Link href="/services">
                  Browse services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">B) Triage wizard</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                JSON-driven eligibility engine. No CPF/RG during anonymous steps; CRM receives only completed, qualified
                leads. Retention: exit intent and Meta/WhatsApp bots feeding the same pipeline.
              </p>
              <Button
                asChild
                className="gradient-primary mt-6 inline-flex gap-2 rounded-full border-0 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
              >
                <Link href="/triage">
                  Launch wizard demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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
                <p className="text-xl font-bold leading-none text-foreground sm:text-2xl lg:text-3xl">{s.value}</p>
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
              CRM with Kanban and table views, family &quot;satellite&quot; contracts, finance with grace and hard lock
              billing states, aligned with how citizenship teams actually work.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {[
              {
                title: "Sales & CRM",
                desc: "Kanban + table, secure proposal links, electronic signatures and Stripe handoff.",
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
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-primary-foreground/30 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 sm:text-base"
                >
                  <Link href={isLoggedIn ? dashboardHref : "/login"}>
                    {isLoggedIn ? dashboardLabel : "Client portal"}
                  </Link>
                </Button>
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
            {isLoggedIn ? (
              <Link href={dashboardHref} className="inline-flex font-semibold text-primary hover:underline">
                {dashboardLabel} →
              </Link>
            ) : (
              <>
                <Link href="/login" className="inline-flex font-semibold text-primary hover:underline">
                  Admin backoffice →
                </Link>
                <span className="hidden text-muted-foreground sm:inline">·</span>
                <Link href="/login" className="inline-flex font-semibold text-primary hover:underline">
                  Client portal →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#0b1120] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <div className="space-y-4">
              <BrandLogo href={null} size="md" className="opacity-95" />
              <p className="text-sm font-semibold tracking-tight">Polonia4u</p>
              <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                European citizenship and documentation services for families. Secure workflows, expert guidance, and a
                clear path from eligibility to recognition.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Quick Links</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <Link href="/triage" className="transition-colors hover:text-white">
                    Eligibility triage
                  </Link>
                </li>
                <li>
                  <Link href="#platform" className="transition-colors hover:text-white">
                    Platform
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="transition-colors hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Services</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                {[
                  "Citizenship process tracking",
                  "Document vault & translations",
                  "E-sign & Stripe billing",
                  "Family & satellite contracts",
                ].map((label) => (
                  <li key={label} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Locations</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                {["São Paulo", "Lisboa", "Warszawa"].map((city) => (
                  <li key={city} className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{city}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-8 border-t border-white/10 pt-8 lg:flex-row lg:justify-between lg:gap-6">
            <p className="order-1 text-center text-sm text-slate-400 lg:order-none lg:text-left">
              © {new Date().getFullYear()} Polonia4u. All rights reserved.
            </p>

            <div className="order-2 lg:order-none">
              <SocialNavLinks />
            </div>

            <div className="order-3 flex flex-wrap justify-center gap-6 text-sm text-slate-400 lg:order-none lg:justify-end">
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
