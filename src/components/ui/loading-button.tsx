"use client";

import * as React from "react";
import { Button, ButtonProps } from "./button";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading = false, loadingText, disabled, className, onClick, ...props }, ref) => {
    const [isNavigating, setIsNavigating] = React.useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || isNavigating) return;
      
      setIsNavigating(true);
      
      try {
        if (onClick) {
          await onClick(e);
        }
      } finally {
        // Reset after a delay to show the loading state briefly
        setTimeout(() => {
          setIsNavigating(false);
        }, 500);
      }
    };

    const isLoading = loading || isNavigating;

    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={`relative overflow-hidden ${className || ''}`}
        {...props}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="flex items-center gap-2">
              {/* Spinner */}
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-80"></div>
              {/* Loading Text */}
              {loadingText && (
                <span className="text-sm font-medium opacity-80">
                  {loadingText}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Button Content */}
        <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          {children}
        </span>
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";