import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Checkout canceled · Polonia4u",
  description: "You canceled the payment. No charge was made.",
};

type Props = { searchParams: Promise<{ slug?: string }> };

export default async function CheckoutCancelPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  const retryHref = slug ? `/services/${encodeURIComponent(slug)}` : "/services";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Payment canceled
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You canceled the checkout. No charge was made to your card.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="default" className="gradient-primary border-0 text-primary-foreground">
            <Link href={retryHref}>
              Try again <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
