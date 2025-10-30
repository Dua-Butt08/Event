export function AuthHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 pt-6">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        Event Expert AI
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70" style={{ fontFamily: 'var(--font-heading)'}}>{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-fg-muted">{subtitle}</p> : null}
    </div>
  )
}
