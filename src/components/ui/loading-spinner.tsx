interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-[var(--accent)]/20 border-t-[var(--accent)] ${sizeClasses[size]} ${className || ''}`}
    />
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={`flex space-x-1 justify-center items-center ${className || ''}`}>
      <div className="h-2 w-2 bg-[var(--accent)] rounded-full animate-gentle-fade [animation-delay:-0.6s]"></div>
      <div className="h-2 w-2 bg-[var(--accent)] rounded-full animate-gentle-fade [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-[var(--accent)] rounded-full animate-gentle-fade"></div>
    </div>
  )
}