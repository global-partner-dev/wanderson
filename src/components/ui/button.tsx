import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // ── Solid (filled) ──────────────────────────────────────────────
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: "bg-success text-success-foreground hover:bg-success/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        info: "bg-info text-info-foreground hover:bg-info/90",
        dark: "bg-foreground text-background hover:bg-foreground/90",
        light: "bg-muted text-foreground hover:bg-muted/80 border border-border",

        // ── Soft (tinted backgrounds) ───────────────────────────────────
        "soft-primary": "bg-primary/10 text-primary hover:bg-primary/20",
        "soft-secondary": "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        "soft-success": "bg-success/10 text-success hover:bg-success/20",
        "soft-destructive": "bg-destructive/10 text-destructive hover:bg-destructive/20",
        "soft-warning": "bg-warning/10 text-warning hover:bg-warning/20",
        "soft-info": "bg-info/10 text-info hover:bg-info/20",
        "soft-dark": "bg-foreground/10 text-foreground hover:bg-foreground/20",

        // ── Outline ─────────────────────────────────────────────────────
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        "outline-primary":
          "border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
        "outline-secondary":
          "border border-border text-foreground bg-transparent hover:bg-secondary",
        "outline-success":
          "border border-success text-success bg-transparent hover:bg-success hover:text-success-foreground",
        "outline-destructive":
          "border border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-destructive-foreground",
        "outline-warning":
          "border border-warning text-warning bg-transparent hover:bg-warning hover:text-warning-foreground",
        "outline-info":
          "border border-info text-info bg-transparent hover:bg-info hover:text-info-foreground",
        "outline-dark":
          "border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background",

        // ── Minimal ─────────────────────────────────────────────────────
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-6",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      block: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** When true, renders a spinner, hides text-affecting interaction, and disables the button. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      block,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    // Slot requires exactly one child; wrap content so spinner + children render together.
    const content =
      asChild ? (
        children
      ) : (
        <>
          {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          {children}
        </>
      );
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block }), className)}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-loading={loading ? "true" : undefined}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
