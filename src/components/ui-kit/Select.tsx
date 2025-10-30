"use client";
import * as React from "react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helpText?: string;
  error?: string;
  valid?: boolean;
  invalid?: boolean;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helpText, error, valid, invalid, children, ...props }, ref) => {
    const hasError = Boolean(error);
    const isValid = valid && !hasError;
    const isInvalid = invalid || hasError;
    
    const selectClasses = cn(
      "flex h-12 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus-visible:ring-2",
      "focus:shadow-[0_0_24px_0_rgba(125,211,252,0.25)]",
      !isInvalid && !isValid && "border-[var(--border)] bg-[var(--bg-elev)] text-[var(--text)] placeholder:text-[var(--muted)]",
      isInvalid && "border-[var(--error)] bg-[var(--bg-elev)] text-[var(--text)] placeholder:text-[var(--muted)]",
      isValid && "border-[var(--success)] bg-[var(--bg-elev)] text-[var(--text)] placeholder:text-[var(--muted)]",
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--text)] mb-2">
            {label}
          </label>
        )}
        <select
          className={selectClasses}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {helpText && !hasError && (
          <p className="mt-1 text-sm text-[var(--muted)]">{helpText}</p>
        )}
        {hasError && (
          <p className="mt-1 text-sm text-[var(--error)]">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

// Select States Matrix
export const SelectStates = {
  normal: {
    default: "border-[var(--border)] bg-[var(--bg-elev)] text-[var(--text)] placeholder:text-[var(--muted)]",
    focus: "focus-visible:ring-2 focus:shadow-[0_0_24px_0_rgba(125,211,252,0.25)]",
    hover: "hover:border-[var(--accent)]"
  },
 valid: {
    default: "border-[var(--success)] bg-[var(--bg-elev)] text-[var(--text)] placeholder:text-[var(--muted)]",
    focus: "focus-visible:ring-2 focus:shadow-[0_0_24px_0_rgba(125,211,252,0.25)]",
  },
  invalid: {
    default: "border-[var(--error)] bg-[var(--bg-elev)] text-[var(--text)] placeholder:text-[var(--muted)]",
    focus: "focus-visible:ring-2 focus:shadow-[0_0_24px_0_rgba(125,211,252,0.25)]",
  },
  disabled: {
    default: "opacity-60 cursor-not-allowed",
  }
};
