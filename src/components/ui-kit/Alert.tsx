"use client";
import * as React from "react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'error' | 'info';
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', showIcon = true, closable = false, onClose, children, ...props }, ref) => {
    const variantClasses = {
      default: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm border-border bg-bg-muted/50 text-fg",
      destructive: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm border-danger/40 bg-danger/10 text-danger",
      success: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm bg-[var(--success)]/[0.15] text-[var(--success)] border border-[var(--success)]/30",
      warning: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm bg-[var(--warning)]/[0.15] text-[var(--warning)] border border-[var(--warning)]/30",
      error: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm bg-[var(--error)]/[0.15] text-[var(--error)] border border-[var(--error)]/30",
      info: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm bg-[var(--accent)]/[0.15] text-[var(--accent)] border border-[var(--accent)]/30"
    };

    const iconMap = {
      default: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      destructive: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      success: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {showIcon && (
          <div className={`mr-3 flex-shrink-0 ${variant === 'success' ? 'text-[var(--success)]' : variant === 'warning' ? 'text-[var(--warning)]' : variant === 'error' ? 'text-[var(--error)]' : variant === 'info' ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>
            {iconMap[variant]}
          </div>
        )}
        <div className="flex-1">
          {children}
        </div>
        {closable && (
          <button
            onClick={onClose}
            className={`ml-4 flex-shrink-0 ${variant === 'success' ? 'text-[var(--success)]' : variant === 'warning' ? 'text-[var(--warning)]' : variant === 'error' ? 'text-[var(--error)]' : variant === 'info' ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert };

// Alert States Matrix
export const AlertStates = {
  default: {
    default: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm border-border bg-bg-muted/50 text-fg",
 },
  destructive: {
    default: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm border-danger/40 bg-danger/10 text-danger",
  },
  success: {
    default: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm bg-[var(--success)]/[0.15] text-[var(--success)] border border-[var(--success)]/30",
  },
  warning: {
    default: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm bg-[var(--warning)]/[0.15] text-[var(--warning)] border border-[var(--warning)]/30",
  },
  error: {
    default: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm bg-[var(--error)]/[0.15] text-[var(--error)] border-[var(--error)]/30",
  },
  info: {
    default: "w-full rounded-[var(--radius-ui)] border px-4 py-3 text-sm bg-[var(--accent)]/[0.15] text-[var(--accent)] border border-[var(--accent)]/30",
  }
};
