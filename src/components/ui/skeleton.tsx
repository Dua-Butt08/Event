export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-ui)] bg-fg-muted/10 ${className}`}
    />
  )
}




