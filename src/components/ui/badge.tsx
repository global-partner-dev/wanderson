import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-border bg-background text-foreground shadow-none",
        success: "border-transparent bg-emerald-500 text-white shadow-sm hover:bg-emerald-500/90 dark:bg-emerald-600",
        warning: "border-transparent bg-amber-500 text-white shadow-sm hover:bg-amber-500/90 dark:bg-amber-600",
        info: "border-transparent bg-cyan-500 text-white shadow-sm hover:bg-cyan-500/90 dark:bg-cyan-600",
        blue: "border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-600/90 dark:bg-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Gradient date/time tile (sky → violet) for schedule and activity lists. */
function ScheduleDateBadge({
  dateLine,
  timeLine,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { dateLine: string; timeLine: string }) {
  return (
    <div
      className={cn(
        "flex h-[3.75rem] w-[3.75rem] shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-sky-400 to-violet-600 px-1.5 text-center text-white shadow-md",
        className,
      )}
      {...props}
    >
      <span className="text-[11px] font-bold leading-tight">{dateLine}</span>
      <span className="mt-0.5 text-[10px] font-semibold leading-tight text-white/90">{timeLine}</span>
    </div>
  );
}

export { Badge, badgeVariants, ScheduleDateBadge };
