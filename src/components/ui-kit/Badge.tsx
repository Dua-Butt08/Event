"use client";
import * as React from "react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variantClasses = {
      default: "bg-[var(--bg-elev)] text-[var(--text)] border border-[var(--border)]",
      primary: "bg-[var(--accent)] text-[var(--color-bg)]",
      secondary: "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]",
      success: "bg-[var(--success)] text-[var(--color-bg)]",
      warning: "bg-[var(--warning)] text-[var(--color-bg)]",
      error: "bg-[var(--error)] text-[var(--color-bg)]",
      outline: "border border-[var(--border)] text-[var(--text)] bg-transparent"
    };

    const sizeClasses = {
      sm: "text-xs px-2 py-0.5 rounded",
      md: "text-sm px-2.5 py-0.5 rounded-md",
      lg: "text-base px-3 py-1 rounded-lg"
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };

// Badge States Matrix
export const BadgeStates = {
  default: {
    default: "bg-[var(--bg-elev)] text-[var(--text)] border border-[var(--border)]",
  },
  primary: {
    default: "bg-[var(--accent)] text-[var(--color-bg)]",
  },
  secondary: {
    default: "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]",
  },
 success: {
    default: "bg-[var(--success)] text-[var(--color-bg)]",
  },
  warning: {
    default: "bg-[var(--warning)] text-[var(--color-bg)]",
  },
  error: {
    default: "bg-[var(--error)] text-[var(--color-bg)]",
  },
  outline: {
    default: "border border-[var(--border)] text-[var(--text)] bg-transparent",
  }
};
