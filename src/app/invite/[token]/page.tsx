import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { InvitationSnapshot } from "@/lib/ecommerce/types";
import ClaimForm from "./ClaimForm";

export const metadata: Metadata = {
  title: "Claim your account · Polonia4u",
  description: "Set a password to activate your client portal access.",
};

type Props = { params: Promise<{ token: string }> };

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: inviteRaw, error } = await supabase
    .rpc("get_invitation_by_token", { p_token: token })
    .single();
  const invite = inviteRaw as InvitationSnapshot | null;

  if (error || !invite) {
    return (
      <InviteShell>
        <ErrorCard
          title="Invitation not found"
          body="This invitation link is invalid or has been removed. If you just paid, wait a minute and refresh — the webhook may still be processing."
        />
      </InviteShell>
    );
  }

  const expiresAt = new Date(invite.expires_at);
  const expired = expiresAt < new Date();
  const claimed = invite.claimed_at != null;

  if (claimed) {
    return (
      <InviteShell>
        <ErrorCard
          title="Invitation already used"
          body="This invitation link has already been used to create an account. Sign in to access your portal."
          ctaHref="/login"
          ctaLabel="Go to sign in"
        />
      </InviteShell>
    );
  }

  if (expired) {
    return (
      <InviteShell>
        <ErrorCard
          title="Invitation expired"
          body="This invitation is no longer valid. Please contact support to receive a new link for your order."
        />
      </InviteShell>
    );
  }

  return (
    <InviteShell>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-foreground">Set a password for your account</p>
          <p className="mt-1 text-muted-foreground">
            We will create your account linked to{" "}
            <span className="font-semibold text-foreground">{invite.email}</span>. After
            signing in you will land on your client portal.
          </p>
        </div>
      </div>

      <ClaimForm
        token={token}
        email={invite.email}
        defaultName={invite.full_name ?? ""}
      />
    </InviteShell>
  );
}

function InviteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-stretch justify-center px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Claim your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Finish creating your Polonia4u client portal access.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}

function ErrorCard({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
