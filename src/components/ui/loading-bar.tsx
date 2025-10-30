"use client";

import { useEffect, useState, useCallback, useRef } from 'react';

export function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = useCallback(() => {
    // Use setTimeout to defer the state update to the next tick
    setTimeout(() => {
      setIsLoading(true);
      setProgress(0);
      
      // Clear any existing intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Simulate realistic loading progress
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) return prev + Math.random() * 15;
          if (prev < 60) return prev + Math.random() * 10;
          if (prev < 90) return prev + Math.random() * 5;
          return prev + Math.random() * 2;
        });
      }, 100);

      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 300);
      }, 1000);
    }, 0);
  }, []);

  const handleComplete = useCallback(() => {
    // Use setTimeout to defer the state update to the next tick
    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    }, 0);
  }, []);

  useEffect(() => {
    // Listen for navigation events
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function(...args) {
      handleStart();
      return originalPush.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      handleStart();
      return originalReplace.apply(this, args);
    };

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', handleStart);

    // Listen for page load completion
    window.addEventListener('load', handleComplete);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener('popstate', handleStart);
      window.removeEventListener('load', handleComplete);
      
      // Clean up intervals and timeouts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
 }, [handleStart, handleComplete]);

  if (!isLoading) return null;

  return (
    <>
      {/* Top Progress Bar - Subtle and elegant */}
      <div className="fixed top-0 left-0 right-0 z-[9999]">
        <div 
          className="h-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] transition-all duration-300 ease-out"
          style={{ 
            width: `${Math.min(progress, 100)}%`,
            boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.5)',
          }}
        >
          {/* Shimmer effect */}
          <div className="h-full w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export function PageLoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = useCallback(() => {
    // Use setTimeout to defer the state update to the next tick
    setTimeout(() => {
      setIsLoading(true);
    }, 0);
  }, []);

  useEffect(() => {
    // For Next.js App Router
    window.addEventListener('beforeunload', handleStart);
    
    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, [handleStart]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse">
        <div className="h-full bg-gradient-to-r from-accent to-accent-2 animate-pulse"></div>
      </div>
    </div>
  );
}
