"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "text-[var(--color-bg)] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] shadow-[0_8px_30px_rgba(79,70,229,0.25)] hover:brightness-105 hover:-translate-y-[1px]",
        outline: "border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-elev)]",
        subtle: "text-[var(--text)] hover:bg-[var(--bg-elev)]",
        ghost: "hover:bg-[var(--bg-elev)]",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Button States Matrix
export const ButtonStates = {
 primary: {
    normal: "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-[var(--color-bg)]",
    hover: "hover:brightness-105 hover:-translate-y-[1px]",
    focus: "focus-visible:ring-2 focus-visible:ring-ring",
    disabled: "disabled:opacity-60 disabled:cursor-not-allowed",
  },
  outline: {
    normal: "border border-[var(--border)] text-[var(--text)]",
    hover: "hover:bg-[var(--bg-elev)]",
    focus: "focus-visible:ring-2 focus-visible:ring-ring",
    disabled: "disabled:opacity-60 disabled:cursor-not-allowed",
  },
  subtle: {
    normal: "text-[var(--text)]",
    hover: "hover:bg-[var(--bg-elev)]",
    focus: "focus-visible:ring-2 focus-visible:ring-ring",
    disabled: "disabled:opacity-60 disabled:cursor-not-allowed",
  },
  ghost: {
    normal: "",
    hover: "hover:bg-[var(--bg-elev)]",
    focus: "focus-visible:ring-2 focus-visible:ring-ring",
    disabled: "disabled:opacity-60 disabled:cursor-not-allowed",
  },
  sizes: {
    sm: "h-8 px-2 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  }
};
