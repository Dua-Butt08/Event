import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { BrodysBrain } from '@/components/ui/BrodysBrain';

export default function Loading() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <FuturisticBackground scrollY={0} />
        
        <div className="relative pt-12 pb-12 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="mb-3 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 text-[var(--accent)] border border-[var(--accent)]/30 px-4 py-1.5 text-sm rounded-full inline-block backdrop-blur-sm">
                🎯 Audience Architect™
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.2' }}>
                Create Your Complete Marketing Strategy
              </h1>
              <p className="text-sm text-[var(--muted)] max-w-2xl mx-auto">
                Tell us about your target market and product to generate a complete marketing strategy.
              </p>
            </div>

            <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50 shadow-xl" style={{ minHeight: '400px' }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-[var(--text)]">Your Business Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-[var(--bg-elev)]/50 rounded animate-pulse"></div>
                    <div className="h-24 bg-[var(--bg-elev)]/50 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-[var(--bg-elev)]/50 rounded animate-pulse"></div>
                    <div className="h-24 bg-[var(--bg-elev)]/50 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="h-10 bg-[var(--bg-elev)]/50 rounded-lg animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 text-center">
              <p className="text-xs text-[var(--muted)]">
                💡 Results will appear as they become ready
              </p>
            </div>
          </div>
        </div>
      </div>
      <BrodysBrain />
    </AppLayout>
  );
}
