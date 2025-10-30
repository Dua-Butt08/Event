"use client";
import * as React from "react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

// Extending React.LabelHTMLAttributes is sufficient for this component
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;


const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium text-[var(--text)]",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };

// Label States Matrix
export const LabelStates = {
  default: {
    default: "block text-sm font-medium text-[var(--text)]",
  },
  required: {
    default: "block text-sm font-medium text-[var(--text)]",
  }
};
