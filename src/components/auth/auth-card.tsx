import { Card } from '@/components/ui/card'

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 dark:bg-white/5 border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      {children}
    </Card>
  )
}




