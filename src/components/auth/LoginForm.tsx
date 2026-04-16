"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left — gradient panel (refer auth) */}
      <div className="relative hidden flex-col items-center justify-center overflow-hidden md:flex md:w-2/5 lg:w-1/2 gradient-primary p-8 lg:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-20 h-40 w-40 rounded-full border-2 border-primary-foreground lg:h-72 lg:w-72" />
          <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full border-2 border-primary-foreground lg:h-96 lg:w-96" />
          <div className="absolute left-1/3 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border-2 border-primary-foreground lg:h-48 lg:w-48" />
        </div>
        <div className="relative z-10 text-center">
          <Link href="/" className="mb-8 block w-fit transition-opacity hover:opacity-90 lg:mb-10">
            <span className="text-3xl font-bold tracking-tight text-primary-foreground drop-shadow-md lg:text-4xl">
              Polonia4u<span className="text-amber-200">.</span>
            </span>
          </Link>
          <p className="max-w-md text-base text-primary-foreground/85 lg:text-lg">
            Sign in to continue your citizenship and document workflows — same calm interface as our public site.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6 md:p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex justify-center transition-opacity hover:opacity-80 md:hidden">
            <span className="text-2xl font-bold text-foreground">
              Polonia4u<span className="text-primary">.</span>
            </span>
          </Link>

          <h1 className="text-center text-xl font-bold text-foreground sm:text-2xl">Log in</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground sm:text-base">
            Frontend demo: no authentication is performed.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`${inputClass} mt-1.5`}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="gradient-primary h-11 w-full rounded-lg border-0 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-4 text-center">
            <Link href="/admin" className="text-sm text-muted-foreground transition hover:text-foreground">
              → Admin backoffice (demo)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
