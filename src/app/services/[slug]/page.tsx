import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProductBySlug } from "@/lib/ecommerce/products";
import { CATEGORY_LABEL, formatBRL } from "@/lib/ecommerce/types";
import BuyBox from "./BuyBox";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Service not found" };
  return {
    title: `${product.name} · Services`,
    description: product.description ?? undefined,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          <span className="text-xs text-muted-foreground">Secure checkout</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-start">
          <section>
            <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {CATEGORY_LABEL[product.category]}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            {product.description ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {product.description}
              </p>
            ) : null}

            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Secure hosted checkout by Stripe",
                "Account invitation emailed after payment",
                "Track progress from your client portal",
              ].map((label) => (
                <li key={label} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center">
              <Shield className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground">
                Payments are processed by Stripe in BRL. We never store your card
                details. All order and account data is isolated per user (RLS).
              </p>
            </div>
          </section>

          <aside className="md:sticky md:top-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Price
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                {formatBRL(product.amount_brl_cents)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                One-time payment · BRL · no subscription
              </p>
              <div className="mt-5">
                <BuyBox
                  slug={product.slug}
                  defaultEmail={user?.email ?? null}
                  isAuthenticated={Boolean(user)}
                />
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Lock className="h-3 w-3" />
                You will be redirected to Stripe to complete payment.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
