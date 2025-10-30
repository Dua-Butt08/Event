import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-[var(--text)]">404</h1>
        <h2 className="text-2xl font-semibold text-[var(--text)]">Page Not Found</h2>
        <p className="text-[var(--muted)] max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}