import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listActiveProducts } from "@/lib/ecommerce/products";
import { CATEGORY_LABEL, formatBRL } from "@/lib/ecommerce/types";

export const metadata: Metadata = {
  title: "Services · Direct online sales",
  description:
    "Standalone services you can purchase directly online. No triage required.",
};

export default async function ServicesPage() {
  const products = await listActiveProducts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <span className="text-xs text-muted-foreground">Direct online sales</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Services catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Buy standalone services online
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Standalone SKUs that do not require the eligibility triage. Pay with card
            in a secure Stripe Checkout. An account invitation is emailed after
            payment so you can track the work in your client portal.
          </p>
        </div>

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="mb-3 inline-flex w-fit rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {CATEGORY_LABEL[product.category]}
                </span>
                <h2 className="text-lg font-bold text-foreground sm:text-xl">
                  {product.name}
                </h2>
                {product.description ? (
                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                ) : null}
                <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      From
                    </p>
                    <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">
                      {formatBRL(product.amount_brl_cents)}
                    </p>
                  </div>
                  <Button asChild variant="soft-primary" className="gap-1.5">
                    <Link href={`/services/${product.slug}`}>
                      Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 p-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">No services are published yet</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The catalog is empty. An administrator can add standalone services in the
        backoffice; they will appear here automatically.
      </p>
    </div>
  );
}
