"use client";
import * as React from "react";
import { createPortal } from "react-dom";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl", 
    xl: "max-w-4xl"
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className={cn(
          "relative z-50 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl",
          sizeClasses[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h3 className="text-xl font-semibold text-[var(--text)]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Close"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export { Modal };

// Modal States Matrix
export const ModalStates = {
  open: {
    default: "opacity-100 visible",
    backdrop: "bg-black/70 backdrop-blur-sm",
    content: "scale-100 translate-y-0"
  },
  closed: {
    default: "opacity-0 invisible",
    backdrop: "bg-black/0",
    content: "scale-95 translate-y-4"
  }
};
