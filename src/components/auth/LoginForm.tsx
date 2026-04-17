"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Clock, Eye, EyeOff, Loader2, ShieldX } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthBanner, type AuthBannerTone } from "@/components/ui/auth-banner";
import { createClient } from "@/lib/supabase/client";

type StatusKey =
  | "staff_pending"
  | "staff_rejected"
  | "staff_approved"
  | "email_verified";
type StatusEntry = {
  tone: AuthBannerTone;
  icon: LucideIcon;
  title: string;
  message: string;
};

const STATUS_MESSAGES: Record<StatusKey, StatusEntry> = {
  staff_pending: {
    tone: "warning",
    icon: Clock,
    title: "Awaiting administrator approval",
    message:
      "Your staff access request hasn't been approved yet. You'll be able to sign in as soon as an admin reviews your account.",
  },
  staff_rejected: {
    tone: "danger",
    icon: ShieldX,
    title: "Staff access request declined",
    message:
      "Your staff access request was declined. Please contact an administrator if you believe this is a mistake.",
  },
  staff_approved: {
    tone: "success",
    icon: CheckCircle2,
    title: "Your staff access has been approved",
    message: "Sign in below to enter the backoffice.",
  },
  email_verified: {
    tone: "success",
    icon: CheckCircle2,
    title: "Email confirmed",
    message: "Your email has been verified. Sign in with your password to continue.",
  },
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** From ?status=… in the URL (persists across login attempts). */
  const [urlStatusBanner, setUrlStatusBanner] = useState<StatusEntry | null>(null);
  /** True when the URL asked to show the post–email-confirm message (kept visible if staff login then fails). */
  const [emailVerifiedFromUrl, setEmailVerifiedFromUrl] = useState(false);
  /** Staff pending/rejected (and similar) after a failed login attempt. */
  const [loginAttemptBanner, setLoginAttemptBanner] = useState<StatusEntry | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const status = searchParams.get("status") as StatusKey | null;
    setEmailVerifiedFromUrl(status === "email_verified");
    setError(null);
    if (
      status &&
      status !== "email_verified" &&
      Object.prototype.hasOwnProperty.call(STATUS_MESSAGES, status)
    ) {
      setUrlStatusBanner(STATUS_MESSAGES[status as StatusKey]);
    } else {
      setUrlStatusBanner(null);
    }
  }, [searchParams]);

  function handleSubmit(formData: FormData) {
    setError(null);
    setLoginAttemptBanner(null);
    startTransition(async () => {
      const supabase = createClient();

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError("Unexpected error. Please try again.");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, staff_signup_requested, staff_approval_status")
        .eq("id", data.user.id)
        .single();

      const profileRow = profile as
        | {
            role?: string;
            staff_signup_requested?: boolean;
            staff_approval_status?: "none" | "pending" | "approved" | "rejected";
          }
        | null;

      const staffNotApproved =
        profileRow?.staff_signup_requested === true &&
        profileRow?.staff_approval_status !== "approved";

      if (staffNotApproved) {
        // Sign them straight back out so they hold no session, then surface
        // the appropriate message inline.
        await supabase.auth.signOut();
        const status = profileRow?.staff_approval_status;
        const entry =
          status === "rejected" ? STATUS_MESSAGES.staff_rejected : STATUS_MESSAGES.staff_pending;
        setLoginAttemptBanner(entry);
        setError(null);
        router.refresh();
        return;
      }

      const role = profileRow?.role;
      const redirectTo = role === "admin" || role === "staff" ? "/admin" : "/portal";

      // Refresh server components so middleware/server pages pick up the new
      // session cookies, then navigate to the destination.
      router.refresh();
      router.push(redirectTo);
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
            Sign in to continue your citizenship and document workflows, with the same calm interface as our public site.
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

          <h1 className="text-center text-xl font-bold text-foreground sm:text-2xl">Log in</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground sm:text-base">
            Sign in to your account to continue.
          </p>

          {error && (
            <AuthBanner tone="destructive" title="Sign in failed" message={error} />
          )}

          {(emailVerifiedFromUrl || urlStatusBanner || loginAttemptBanner) && (
            <div className="mt-4 space-y-3">
              {emailVerifiedFromUrl && (
                <AuthBanner
                  tone={STATUS_MESSAGES.email_verified.tone}
                  icon={STATUS_MESSAGES.email_verified.icon}
                  title={STATUS_MESSAGES.email_verified.title}
                  message={STATUS_MESSAGES.email_verified.message}
                />
              )}
              {urlStatusBanner && (
                <AuthBanner
                  tone={urlStatusBanner.tone}
                  icon={urlStatusBanner.icon}
                  title={urlStatusBanner.title}
                  message={urlStatusBanner.message}
                />
              )}
              {loginAttemptBanner && (
                <AuthBanner
                  tone={loginAttemptBanner.tone}
                  icon={loginAttemptBanner.icon}
                  title={loginAttemptBanner.title}
                  message={loginAttemptBanner.message}
                />
              )}
            </div>
          )}

          <form action={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-10"
                  required
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
            <Button
              type="submit"
              disabled={isPending}
              className="gradient-primary h-11 w-full border-0 text-primary-foreground shadow-sm hover:opacity-95"
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Log in
            </Button>
          </form>

          <p className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-muted-foreground transition hover:text-foreground">
              Forgot your password?
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
