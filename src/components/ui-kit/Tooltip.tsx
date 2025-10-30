"use client";
import * as React from "react";

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  show?: boolean;
  delay?: number;
}

const Tooltip = ({ children, content, position = 'top', show, delay = 0 }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };

  const handleMouseEnter = () => {
    setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Use the show prop if provided, otherwise use internal state
  const isTooltipVisible = show !== undefined ? show : isVisible;

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isTooltipVisible && (
        <div 
          className={cn(
            "absolute z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-lg whitespace-nowrap",
            "bg-[var(--card)] border border-[var(--border)] text-[var(--text)]",
            "transition-opacity duration-200",
            positionClasses[position]
          )}
        >
          {content}
          <div className={cn(
            "absolute w-2 h-2 bg-[var(--card)] border border-[var(--border)]",
            position === 'top' && "top-full left-1/2 transform -translate-x-1/2 -mt-1 rotate-45",
            position === 'bottom' && "bottom-full left-1/2 transform -translate-x-1/2 -mb-1 rotate-45",
            position === 'left' && "right-full top-1/2 transform -translate-y-1/2 -mr-1 rotate-45",
            position === 'right' && "left-full top-1/2 transform -translate-y-1/2 -ml-1 rotate-45"
          )} />
        </div>
      )}
    </div>
  );
};

export { Tooltip };

// Tooltip States Matrix
export const TooltipStates = {
  visible: {
    default: "opacity-100 visible",
    position: "absolute z-50"
  },
  hidden: {
    default: "opacity-0 invisible",
    position: "absolute z-50"
  }
};
