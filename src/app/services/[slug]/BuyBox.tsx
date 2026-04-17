"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  slug: string;
  defaultEmail: string | null;
  isAuthenticated: boolean;
};

export default function BuyBox({ slug, defaultEmail, isAuthenticated }: Props) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleBuy() {
    setError(null);

    if (!isAuthenticated) {
      const trimmed = email.trim();
      if (!trimmed) {
        setError("Email is required.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setError("Enter a valid email.");
        return;
      }
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            slug,
            email: isAuthenticated ? undefined : email.trim(),
            full_name: fullName.trim() || undefined,
          }),
        });
        const body = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !body.url) {
          setError(body.error ?? "Could not create checkout session.");
          return;
        }
        window.location.href = body.url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {!isAuthenticated ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="buy-email" className="text-xs">
              Email
            </Label>
            <Input
              id="buy-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="buy-name" className="text-xs">
              Full name <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="buy-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={pending}
            />
          </div>
        </>
      ) : (
        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Signed in — the order will be linked to your account automatically.
        </p>
      )}

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        variant="default"
        size="lg"
        block
        loading={pending}
        onClick={handleBuy}
        className="gradient-primary border-0 text-primary-foreground"
      >
        Pay with Stripe
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
