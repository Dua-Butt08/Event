"use client";
import * as React from "react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, label, disabled = false, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-4 rounded-full p-0.5",
      md: "w-10 h-5 rounded-full p-0.5", 
      lg: "w-12 h-6 rounded-full p-0.5"
    };
    
    const thumbSize = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5"
    };
    
    return (
      <div className="flex items-center">
        {label && <span className="mr-3 text-[var(--text)]">{label}</span>}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            sizeClasses[size],
            "relative inline-flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50",
            checked 
              ? "bg-[var(--accent)] justify-end" 
              : "bg-[var(--border)] justify-start",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          ref={ref}
          {...props}
        >
          <span 
            className={cn(
              thumbSize[size],
              "bg-[var(--color-bg)] rounded-full shadow-md transition-transform duration-200",
              checked ? "transform translate-x-0" : `transform -translate-x-${size === 'sm' ? '1' : size === 'md' ? '1.5' : '2'}`
            )}
          />
        </button>
      </div>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };

// Toggle States Matrix
export const ToggleStates = {
  normal: {
    unchecked: "bg-[var(--border)] justify-start",
    checked: "bg-[var(--accent)] justify-end",
    hover: "hover:opacity-90"
  },
  disabled: {
    default: "opacity-60 cursor-not-allowed",
  }
};
