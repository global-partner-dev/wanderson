"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { claimInvitation } from "@/lib/invite-actions";

type Props = {
  token: string;
  email: string;
  defaultName: string;
};

export default function ClaimForm({ token, email, defaultName }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await claimInvitation(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(res.redirect);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-1.5">
        <Label className="text-xs">Email</Label>
        <Input value={email} disabled readOnly className="bg-muted/40" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="full_name" className="text-xs">
          Full name
        </Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          defaultValue={defaultName}
          placeholder="Jane Doe"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="claim-password" className="text-xs">
          Password
        </Label>
        <div className="relative">
          <Input
            id="claim-password"
            name="password"
            type={showPassword ? "text" : "password"}
            minLength={8}
            required
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

      <div className="space-y-1.5">
        <Label htmlFor="claim-confirm" className="text-xs">
          Confirm password
        </Label>
        <div className="relative">
          <Input
            id="claim-confirm"
            name="confirm"
            type={showConfirm ? "text" : "password"}
            minLength={8}
            required
            autoComplete="new-password"
            placeholder="Re-enter password"
            className="pr-10"
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

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        block
        loading={pending}
        className="gradient-primary border-0 text-primary-foreground"
      >
        Create account and sign in
      </Button>
    </form>
  );
}
