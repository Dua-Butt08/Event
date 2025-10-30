"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { NewFormButton } from '@/components/ui/NewFormButton';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { OriginalInputDisplay } from '@/components/shared/OriginalInputDisplay';
import { useGetSubmissionByIdQuery } from '@/store/api/submissionsApi';

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

const COMPONENTS = [
  {
    id: 'icp',
    key: 'audienceArchitect',
    title: 'Audience Architect™',
    description: 'Deep insights into your ideal customer profile, demographics, pain points, and behavioral patterns.',
    icon: '🎯',
    gradient: 'from-blue-500 to-blue-600',
    path: '/results/icp'
  },
  {
    id: 'content-compass',
    key: 'contentCompass',
    title: 'Content Compass™',
    description: 'Strategic content roadmap with topics, formats, and distribution channels tailored to your audience.',
    icon: '🧭',
    gradient: 'from-green-500 to-green-600',
    path: '/results/content-compass'
  },
  {
    id: 'message-multiplier',
    key: 'messageMultiplier',
    title: 'Message Multiplier™',
    description: 'Compelling messaging framework with value propositions and communication strategies.',
    icon: '💬',
    gradient: 'from-purple-500 to-purple-600',
    path: '/results/message-multiplier'
  },
  {
    id: 'funnel',
    key: 'eventFunnel',
    title: 'Event Funnel',
    description: 'Complete customer journey mapping with touchpoints, events, and conversion optimization.',
    icon: '🌊',
    gradient: 'from-orange-500 to-orange-600',
    path: '/results/funnel',
    onDemand: true
  },
  {
    id: 'landing',
    key: 'landingPage',
    title: 'Landing Page Strategy',
    description: 'High-converting landing page blueprint with copy, design, and optimization recommendations.',
    icon: '🚀',
    gradient: 'from-pink-500 to-pink-600',
    path: '/results/landing',
    onDemand: true
  }
];

type ComponentStatus = 'pending' | 'completed' | 'failed' | 'not_requested';

type ComponentStatusMap = Record<string, ComponentStatus>;

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { status: authStatus } = useSession();
  
  // UI state only
  const [scrollY, setScrollY] = useState(0);

  // RTK Query handles all data fetching, caching, and polling automatically
  // Polling is built into the API definition (see submissionsApi.ts)
  const { data, error, isLoading, isFetching } = useGetSubmissionByIdQuery(id, {
    // Skip query if not authenticated
    skip: authStatus !== 'authenticated',
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, router]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Derive component status map from data
  const componentStatus = useMemo(() => {
    if (!data?.components) return {};
    return (data.components as { componentStatus?: ComponentStatusMap })?.componentStatus || {};
  }, [data]);

  // Determine if we have any pending components (for UI feedback)
  const hasPendingComponents = useMemo(() => {
    return Object.values(componentStatus).some(status => status === 'pending');
  }, [componentStatus]);

  const ComponentCard = ({ config }: { config: typeof COMPONENTS[0] }) => {
    const status = componentStatus[config.key];
    const hasData = !!data?.components?.[config.key as keyof typeof data.components];
    
    const isReady = status === 'completed' && hasData;
    const isProcessing = status === 'pending';
    const isFailed = status === 'failed';
    const isNotRequested = status === 'not_requested' || (!status && !hasData);
    
    const messageMultiplierReady = componentStatus.messageMultiplier === 'completed';
    const canGenerate = config.onDemand && isNotRequested && messageMultiplierReady;
    
    const handleClick = () => {
      if (isReady) {
        router.push(`${config.path}?id=${id}`);
      } else if (canGenerate) {
        router.push(`/event-funnel?submissionId=${id}`);
      }
    };
    
    return (
      <Card 
        className={`group relative overflow-hidden transition-all duration-300 ${
          (isReady || canGenerate) 
            ? 'cursor-pointer hover:shadow-xl hover:-translate-y-2' 
            : 'opacity-60 cursor-not-allowed'
        }`}
        onClick={handleClick}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} ${
          isReady ? 'opacity-5 group-hover:opacity-10' : 'opacity-3'
        } transition-opacity duration-300`} />
        
        {isProcessing && (
          <div className="absolute inset-0 rounded-2xl border-2 border-orange-500 animate-pulse" />
        )}
        
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} text-white mb-4 shadow-md ${
              isReady ? 'group-hover:scale-110' : ''
            } transition-all duration-300`}>
              <span className="text-2xl">{config.icon}</span>
            </div>
            
            {isReady && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-green-400">✓ Ready</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-semibold text-orange-400">⏳ Generating</span>
              </div>
            )}
            {isFailed && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-red-400">✗ Failed</span>
              </div>
            )}
            {isNotRequested && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-500/20 border border-gray-500/30">
                <div className="w-2 h-2 rounded-full bg-gray-500" />
                <span className="text-xs font-semibold text-gray-400">No Submission</span>
              </div>
            )}
          </div>
          
          <CardTitle className="text-xl font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-300">
            {config.title}
          </CardTitle>
          
          <CardDescription className="text-[var(--muted)] leading-relaxed">
            {config.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <Button
            disabled={!isReady && !canGenerate}
            className={`w-full ${
              (isReady || canGenerate)
                ? `bg-gradient-to-r ${config.gradient} hover:shadow-lg hover:scale-105` 
                : 'bg-gray-400'
            } transition-all duration-300`}
            size="lg"
          >
            {isReady ? (
              <>Explore {config.title} →</>
            ) : isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : isFailed ? (
              'Generating Failed'
            ) : canGenerate ? (
              'Generate Funnel & Landing Page'
            ) : (
              'No Submission'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Loading state - show spinner
  if (authStatus === 'loading' || isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4" />
            <p className="text-lg text-[var(--muted)]">Loading your strategy...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error || !data) {
    const errorMessage = error 
      ? (typeof error === 'object' && error && 'error' in error 
          ? (error as { error?: string }).error 
          : typeof error === 'object' && error && 'message' in error
          ? (error as { message?: string }).message
          : 'Failed to load submission')
      : 'Failed to load submission';

    return (
      <AppLayout>
        <div className="min-h-screen bg-background relative overflow-hidden">
          <FuturisticBackground scrollY={scrollY} />
          <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
            <Card className="max-w-lg mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto w-24 h-24 mb-6 rounded-3xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <div className="text-5xl">⚠️</div>
                </div>
                <CardTitle className="text-2xl font-bold mb-3">Something Went Wrong</CardTitle>
                <CardDescription>{errorMessage}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3 justify-center">
                <Button onClick={() => window.location.reload()}>🔄 Retry</Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <FuturisticBackground scrollY={scrollY} />
        
        <div className="relative z-10 px-6 pt-8">
          <div className="max-w-7xl mx-auto mb-8">
            <OriginalInputDisplay 
              inputs={data.inputs} 
              defaultOpen={false}
              variant="collapsible"
            />
          </div>
        </div>
        
        <div className="relative z-10 pt-20 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-2">
                Your Marketing Strategy
              </h1>
              {hasPendingComponents && (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--accent)]" />
                  <p className="text-lg text-[var(--accent)] font-medium animate-pulse">
                    Generating your strategy... Results will appear as they become ready
                  </p>
                </div>
              )}
              {isFetching && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  <p className="text-sm text-[var(--muted)] font-medium">
                    Checking for updates...
                  </p>
                </div>
              )}
              <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
                {hasPendingComponents
                  ? "Watch as each component becomes available. You can click on any ready component to view it immediately!"
                  : "We've analyzed your business and created a comprehensive marketing strategy. Explore each component below to discover actionable insights tailored specifically for your target market."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {COMPONENTS.map(config => (
                <ComponentCard key={config.id} config={config} />
              ))}
            </div>

            <Card className="bg-[var(--card)]/80 backdrop-blur-xl border-[var(--border)]/50 shadow-xl mb-12">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <span>📊</span>
                  <span>Strategy Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-elev)]/50">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                      {COMPONENTS.filter(c => componentStatus[c.key] === 'completed').length}
                    </div>
                    <div className="text-sm text-[var(--muted)] font-medium">Components Ready</div>
                  </div>
                  <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-elev)]/50">
                    <div className="text-3xl font-bold text-blue-500">🎯</div>
                    <div className="text-sm text-[var(--muted)] font-medium">Personalized</div>
                  </div>
                  <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-elev)]/50">
                    <div className="text-3xl font-bold text-purple-500">🚀</div>
                    <div className="text-sm text-[var(--muted)] font-medium">Ready to Deploy</div>
                  </div>
                  <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-elev)]/50">
                    <div className="text-3xl font-bold text-green-500">
                      {data.status === 'completed' ? '✓' : '⏳'}
                    </div>
                    <div className="text-sm text-[var(--muted)] font-medium">
                      {data.status === 'completed' ? 'Complete' : 'In Progress'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-[var(--muted)] mb-6 text-lg">
                Ready to create another winning strategy? 
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <NewFormButton size="lg" />
                <Button
                  onClick={() => router.push('/offer-prompt')}
                  className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
                  size="lg"
                >
                  💡 Generate Offer Prompt
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
