"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
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
            Create an account to explore the demo. Styling matches our marketing site and admin experience.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-background px-4 py-8 sm:px-6 md:p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex justify-center transition-opacity hover:opacity-80 md:hidden">
            <span className="text-2xl font-bold text-foreground">
              Polonia4u<span className="text-primary">.</span>
            </span>
          </Link>

          <h1 className="text-center text-xl font-bold text-foreground sm:text-2xl">Create your account</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground sm:text-base">
            Frontend demo: no data is saved or sent to a server.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input id="signup-name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="pr-10"
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
            <Button type="submit" className="gradient-primary h-11 w-full border-0 text-primary-foreground shadow-sm hover:opacity-95">
              Create account
            </Button>
          </form>

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
