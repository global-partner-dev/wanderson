import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            Polonia4u<span className="text-amber-500">.</span>
          </Link>
          <nav className="flex items-center gap-3 md:gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24 md:text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-600">Citizenship &amp; document services</p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Your path to Polish citizenship, organized end to end
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-600">
            Track leads, cases, proposals, and documents in one place. Built for teams who need clarity from first contact to signature.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center md:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Get started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-bold text-slate-800 transition hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Team member?{" "}
            <Link href="/admin" className="font-semibold text-blue-600 hover:underline">
              Open admin backoffice
            </Link>
          </p>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3 md:gap-8 md:px-6">
            {[
              { title: "Sales & CRM", desc: "Lead funnel, proposals, and contracts in one pipeline." },
              { title: "Operations", desc: "Citizenship cases, document search, translation, and USC workflows." },
              { title: "Finance", desc: "Categorized revenue views to match how your firm actually works." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                <CheckCircle2 className="mb-4 h-10 w-10 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 py-16 md:py-20">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-900 px-6 py-12 text-center text-white md:px-10">
            <LayoutDashboard className="mx-auto mb-4 h-12 w-12 text-amber-400" />
            <h2 className="text-2xl font-bold md:text-3xl">Ready to try the dashboard?</h2>
            <p className="mt-3 text-slate-300">This is a frontend-only demo. No accounts or data are stored.</p>
            <Link
              href="/admin"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white transition hover:bg-blue-500"
            >
              Open admin (demo)
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Polonia4u. Demo interface.</p>
      </footer>
    </div>
  );
}
