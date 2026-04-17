"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthBanner } from "@/components/ui/auth-banner";
import { resetPassword } from "@/lib/auth-actions";

type Props = {
  initialFullName?: string;
};

export default function ResetPasswordForm({ initialFullName = "" }: Props) {
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
    const fullName = ((formData.get("full_name") as string) ?? "").trim();

    if (fullName.length > 0 && fullName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(formData);
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
            Choose a strong password to secure your account.
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

          <h1 className="text-center text-xl font-bold text-foreground sm:text-2xl">Set new password</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground sm:text-base">
            Enter your new password below.
          </p>

          {error && (
            <AuthBanner tone="destructive" title="We couldn't update your password" message={error} />
          )}

          {success ? (
            <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/50">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Password updated</p>
                <p className="mt-1 text-sm text-muted-foreground">{success}</p>
              </div>
              <Link
                href="/login"
                className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Continue to login
              </Link>
            </div>
          ) : (
            <form action={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-fullname">Full name</Label>
                <Input
                  id="reset-fullname"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  defaultValue={initialFullName}
                  minLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reset-password">New password</Label>
                <div className="relative">
                  <Input
                    id="reset-password"
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
                <Label htmlFor="reset-confirm">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="reset-confirm"
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
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="gradient-primary h-11 w-full border-0 text-primary-foreground shadow-sm hover:opacity-95"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
