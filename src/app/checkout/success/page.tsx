import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";
import { formatBRL } from "@/lib/ecommerce/types";

export const metadata: Metadata = {
  title: "Payment successful · Polonia4u",
  description: "Your payment was received. Check your email to create your account.",
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let amountLabel = "";
  let email = "";
  let orderId: string | null = null;
  let inviteToken: string | null = null;

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.amount_total != null) {
        amountLabel = formatBRL(session.amount_total);
      }
      email = session.customer_details?.email ?? session.customer_email ?? "";
    } catch {
      // Non-fatal: Stripe key missing or session not visible yet.
    }

    const supabase = await createClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_email, amount_total_cents")
      .eq("stripe_checkout_session_id", session_id)
      .maybeSingle();
    if (order) {
      orderId = order.id as string;
      if (!email) email = (order.customer_email as string) ?? "";
      if (!amountLabel && order.amount_total_cents != null) {
        amountLabel = formatBRL(order.amount_total_cents as number);
      }

      const { data: invite } = await supabase
        .from("invitations")
        .select("token, claimed_at")
        .eq("order_id", order.id)
        .is("claimed_at", null)
        .order("created_at", { ascending: false })
        .maybeSingle();
      if (invite?.token) inviteToken = invite.token as string;
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Payment received
        </h1>
        {amountLabel ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you. We captured <span className="font-semibold text-foreground">{amountLabel}</span> for your order.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Thank you. Your order is confirmed.</p>
        )}

        <div className="mt-8 w-full rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-foreground">Next step: create your account</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {email ? (
                  <>We will send an invitation to <span className="font-semibold text-foreground">{email}</span>. Follow the link to set a password and access your client portal.</>
                ) : (
                  <>We will email you a secure invitation link to create your client account.</>
                )}
              </p>

              {inviteToken ? (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button asChild className="gradient-primary border-0 text-primary-foreground">
                    <Link href={`/invite/${inviteToken}`}>
                      Open invitation now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="mt-4 rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                  The invitation will appear here as soon as the payment webhook is
                  processed. You can safely close this page and wait for the email.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3 text-sm">
          <Link href="/" className="font-semibold text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
          <span className="text-border">|</span>
          <Link href="/services" className="font-semibold text-muted-foreground hover:text-foreground">
            Browse services
          </Link>
        </div>

        {orderId ? (
          <p className="mt-8 text-[10px] uppercase tracking-widest text-muted-foreground">
            Order ref · {orderId.slice(0, 8)}
          </p>
        ) : null}
      </main>
    </div>
  );
}
