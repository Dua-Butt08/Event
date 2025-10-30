"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FuturisticBackground } from "@/components/visuals/FuturisticBackground";

interface ErrorStateProps {
  error: string;
  componentName: string;
  icon?: string;
  scrollY?: number;
}

export function ErrorState({ error, componentName, scrollY = 0 }: ErrorStateProps) {
  const router = useRouter();
  
  const isNoSubmissionError = error.includes('submission ID') || error.includes('No submission');
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FuturisticBackground scrollY={scrollY} />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-lg mx-auto bg-[var(--card)]/80 backdrop-blur-xl border-[var(--border)]/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            {/* Icon with gradient background */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
              
              {/* Icon SVG */}
              {isNoSubmissionError ? (
                <svg className="w-12 h-12 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-red-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            
            {/* Title */}
            <CardTitle className="text-2xl font-bold text-[var(--text)] mb-3">
              {isNoSubmissionError ? 'No Strategy Selected' : 'Unable to Load Data'}
            </CardTitle>
            
            {/* Description */}
            <CardDescription className="text-base text-[var(--muted)] leading-relaxed">
              {isNoSubmissionError ? (
                <>
                  To view your <span className="font-semibold text-[var(--accent)]">{componentName}</span> insights, 
                  please create a marketing strategy first or select one from your dashboard.
                </>
              ) : (
                <>{error}</>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3 pt-0">
            {/* Primary Action */}
            <Button 
              onClick={() => router.push('/audience-architect')} 
              className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] hover:shadow-xl hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✨</span>
                <span>Create Marketing Strategy</span>
                <span>→</span>
              </span>
            </Button>
            
            {/* Secondary Action */}
            <Button 
              onClick={() => router.push('/dashboard')} 
              variant="outline"
              className="w-full border-[var(--border)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all duration-300"
              size="lg"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>←</span>
                <span>Back to Dashboard</span>
              </span>
            </Button>
            
            {/* Help Text */}
            <div className="pt-4 text-center">
              <p className="text-xs text-[var(--muted)]">
                💡 Need help? Your marketing strategy takes about 2 minutes to generate.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
