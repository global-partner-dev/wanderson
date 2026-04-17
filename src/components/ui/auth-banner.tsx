import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Clock, Mail, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";

export type AuthBannerTone =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "destructive";

type ToneStyles = {
  role: "alert" | "status";
  container: string;
  accent: string;
  iconWrap: string;
  iconColor: string;
  defaultIcon: LucideIcon;
};

const TONE_STYLES: Record<AuthBannerTone, ToneStyles> = {
  info: {
    role: "status",
    container: "border-border bg-card shadow-sm",
    accent: "before:bg-sky-500",
    iconWrap: "bg-sky-50 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-400/30",
    iconColor: "text-sky-600 dark:text-sky-300",
    defaultIcon: Mail,
  },
  success: {
    role: "status",
    container: "border-border bg-card shadow-sm",
    accent: "before:bg-emerald-500",
    iconWrap:
      "bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-400/30",
    iconColor: "text-emerald-600 dark:text-emerald-300",
    defaultIcon: CheckCircle2,
  },
  warning: {
    role: "status",
    container: "border-border bg-card shadow-sm",
    accent: "before:bg-sky-500",
    iconWrap: "bg-sky-50 ring-1 ring-sky-200 dark:bg-sky-500/10 dark:ring-sky-400/30",
    iconColor: "text-sky-600 dark:text-sky-300",
    defaultIcon: Clock,
  },
  danger: {
    role: "alert",
    container: "border-border bg-card shadow-sm",
    accent: "before:bg-rose-500",
    iconWrap: "bg-rose-50 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:ring-rose-400/30",
    iconColor: "text-rose-600 dark:text-rose-300",
    defaultIcon: ShieldX,
  },
  destructive: {
    role: "alert",
    container: "border-border bg-card shadow-sm",
    accent: "before:bg-destructive",
    iconWrap: "bg-destructive/5 ring-1 ring-destructive/25 dark:bg-destructive/10",
    iconColor: "text-destructive",
    defaultIcon: AlertCircle,
  },
};

export interface AuthBannerProps {
  tone: AuthBannerTone;
  title: string;
  message?: string;
  icon?: LucideIcon;
  className?: string;
}

export function AuthBanner({ tone, title, message, icon, className }: AuthBannerProps) {
  const styles = TONE_STYLES[tone] ?? TONE_STYLES.destructive;
  const Icon = icon ?? styles.defaultIcon;

  return (
    <div
      role={styles.role}
      className={cn(
        "relative mt-6 flex items-start gap-3 overflow-hidden rounded-lg border p-4 pl-5 text-sm",
        "before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r-full",
        styles.container,
        styles.accent,
        className,
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          styles.iconWrap,
        )}
      >
        <Icon className={cn("h-4 w-4", styles.iconColor)} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 leading-relaxed">
        <p className="text-[0.9rem] font-semibold tracking-tight text-foreground">{title}</p>
        {message ? (
          <p className="mt-1 text-[0.8125rem] text-muted-foreground">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
