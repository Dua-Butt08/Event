"use client";

import { useEffect, useState, useRef } from 'react';

export function TopLoadingBar() {
  const [progress, setProgress] = useState(10); // Start at 10 to show immediately
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate realistic loading progress with smoother increments
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        // Slow down as we approach 90%
        if (prev < 30) return prev + Math.random() * 15;
        if (prev < 60) return prev + Math.random() * 8;
        if (prev < 80) return prev + Math.random() * 4;
        if (prev < 90) return prev + Math.random() * 1.5;
        return Math.min(prev + Math.random() * 0.3, 90); // Cap at 90
      });
    }, 250); // Slightly faster updates

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div 
        className="h-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] transition-all duration-300 ease-out"
        style={{ 
          width: `${Math.min(progress, 90)}%`,
          boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.5)',
        }}
      >
        {/* Shimmer effect */}
        <div className="h-full w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}
