"use client";
import * as React from "react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  valid?: boolean;
  invalid?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, valid, invalid, children, ...props }, ref) => {
    const hasError = Boolean(error);
    const isValid = valid && !hasError;
    const isInvalid = invalid || hasError;
    
    const checkboxClasses = cn(
      "h-5 w-5 rounded border-2 cursor-pointer transition-all",
      !isInvalid && !isValid && "border-[var(--border)] bg-[var(--bg-elev)] text-[var(--accent)]",
      isInvalid && "border-[var(--error)] bg-[var(--bg-elev)] text-[var(--error)]",
      isValid && "border-[var(--success)] bg-[var(--bg-elev)] text-[var(--success)]",
      className
    );

    return (
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          {...props}
        />
        <div 
          className={cn(
            checkboxClasses,
            "flex items-center justify-center",
            props.checked && "bg-transparent border-[var(--accent)]"
          )}
        >
          {props.checked && (
            <svg 
              className="h-3 w-3 text-[var(--accent)]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </div>
        {label && <span className="text-[var(--text)]">{label}</span>}
        {children}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

// Checkbox States Matrix
export const CheckboxStates = {
  normal: {
    unchecked: "border-[var(--border)] bg-[var(--bg-elev)]",
    checked: "bg-[var(--accent)] border-[var(--accent)]",
    hover: "hover:opacity-80"
  },
 valid: {
    unchecked: "border-[var(--success)] bg-[var(--bg-elev)]",
    checked: "bg-[var(--success)] border-[var(--success)]",
  },
  invalid: {
    unchecked: "border-[var(--error)] bg-[var(--bg-elev)]",
    checked: "bg-[var(--error)] border-[var(--error)]",
  },
  disabled: {
    default: "opacity-60 cursor-not-allowed",
  }
};
