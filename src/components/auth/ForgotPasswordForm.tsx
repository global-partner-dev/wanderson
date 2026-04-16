"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/auth-actions";

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await forgotPassword(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden md:flex md:w-2/5 lg:w-1/2 gradient-primary p-8 lg:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-20 h-40 w-40 rounded-full border-2 border-primary-foreground lg:h-72 lg:w-72" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full border-2 border-primary-foreground lg:h-96 lg:w-96" />
          <div className="absolute left-1/3 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border-2 border-primary-foreground lg:h-48 lg:w-48" />
        </div>
        <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
          <BrandLogo
            href="/"
            size="2xl"
            className="drop-shadow-md"
            linkClassName="mb-8 flex w-fit justify-center transition-opacity hover:opacity-90 lg:mb-10"
          />
          <p className="max-w-md text-base text-primary-foreground/85 lg:text-lg">
            We&apos;ll send you a link to reset your password and get back into your account.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6 md:p-8">
        <div className="w-full max-w-md">
          <BrandLogo
            href="/"
            size="lg"
            linkClassName="mb-8 flex justify-center transition-opacity hover:opacity-80 md:hidden"
          />

          <h1 className="text-center text-xl font-bold text-foreground sm:text-2xl">Reset your password</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground sm:text-base">
            Enter the email address linked to your account.
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success ? (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Check your inbox</p>
                <p className="mt-1 text-sm text-muted-foreground">{success}</p>
              </div>
            </div>
          ) : (
            <form action={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="gradient-primary h-11 w-full border-0 text-primary-foreground shadow-sm hover:opacity-95"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send reset link
              </Button>
            </form>
          )}

          <p className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
