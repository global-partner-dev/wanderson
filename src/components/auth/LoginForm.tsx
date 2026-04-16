"use client";

import Link from "next/link";
import { FormEvent } from "react";

export default function LoginForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="text-lg font-bold text-slate-900">
            Polonia4u<span className="text-amber-500">.</span>
          </Link>
          <Link href="/signup" className="text-sm font-semibold text-blue-600 hover:underline">
            Create account
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-slate-900">Log in</h1>
          <p className="mt-2 text-center text-sm text-slate-500">Frontend demo: no authentication is performed.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-4 text-center">
            <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800">
              → Admin backoffice (demo)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
