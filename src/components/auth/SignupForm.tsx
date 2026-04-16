"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);

    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    startTransition(async () => {
      const result = await signup(formData);
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
            Create an account to access your citizenship and document workflows.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-background px-4 py-8 sm:px-6 md:p-8">
        <div className="w-full max-w-md">
          <BrandLogo
            href="/"
            size="lg"
            linkClassName="mb-8 flex justify-center transition-opacity hover:opacity-80 md:hidden"
          />

          <h1 className="text-center text-xl font-bold text-foreground sm:text-2xl">Create your account</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground sm:text-base">
            Get started with Polonia4u.
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="card-shadow mt-6 flex gap-4 rounded-xl border border-primary/25 bg-primary/10 p-4 ring-1 ring-primary/15 dark:border-primary/35 dark:bg-primary/15 dark:ring-primary/20"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-sm"
                aria-hidden
              >
                <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="min-w-0 pt-0.5 text-sm font-medium leading-relaxed text-foreground">
                {success}
              </p>
            </div>
          )}

          {!success && (
            <form action={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full name</Label>
                <Input id="signup-name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className="pr-10"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-10 rounded-l-none text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="signup-confirm"
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    className="pr-10"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-10 rounded-l-none text-muted-foreground hover:text-foreground"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-3 py-3">
                <input
                  type="checkbox"
                  name="staff"
                  id="signup-staff"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Label htmlFor="signup-staff" className="cursor-pointer text-sm font-normal leading-snug text-foreground">
                  I am a staff of this company
                </Label>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="gradient-primary h-11 w-full border-0 text-primary-foreground shadow-sm hover:opacity-95"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create account
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
