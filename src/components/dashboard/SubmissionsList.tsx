"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSubmissionData } from "@/lib/storage";
import { FuturisticBackground } from "@/components/visuals/FuturisticBackground";
// Component configurations moved inline
const componentConfigs = [
  {
    id: 'icp',
    title: 'Audience Architect™',
    description: 'Deep insights into your ideal customer profile, demographics, pain points, and behavioral patterns.',
    icon: '🎯',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    path: '/results/icp'
  },
  {
    id: 'content-compass',
    title: 'Content Compass™',
    description: 'Strategic content roadmap with topics, formats, and distribution channels tailored to your audience.',
    icon: '🧭',
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    path: '/results/content-compass'
  },
  {
    id: 'message-multiplier',
    title: 'Message Multiplier™',
    description: 'Compelling messaging framework with value propositions and communication strategies.',
    icon: '💬',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    path: '/results/message-multiplier'
  },
  {
    id: 'funnel',
    title: 'Event Funnel',
    description: 'Complete customer journey mapping with touchpoints, events, and conversion optimization.',
    icon: '🌊',
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    path: '/results/funnel'
  },
  {
    id: 'landing',
    title: 'Landing Page Strategy',
    description: 'High-converting landing page blueprint with copy, design, and optimization recommendations.',
    icon: '🚀',
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    path: '/results/landing'
  }
];
import { useGetSubmissionsQuery, useRetrySubmissionMutation, useCheckStaleSubmissionsMutation, usePrefetch, submissionsApi } from '@/store/api/submissionsApi';
import { HistoryTable } from '@/components/dashboard/HistoryTable';

interface ComponentCardProps {
  config: typeof componentConfigs[0];
  latestSubmission: FormSubmissionData | null;
  isLoading: boolean;
  componentKey: string; // Added to check specific component status
}

function PremiumComponentCard({ config, latestSubmission, componentKey }: ComponentCardProps) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  
  // RTK Query hooks
  const prefetchSubmission = usePrefetch('getSubmissionById');
  const [retrySubmission] = useRetrySubmissionMutation();
  
  // Check if this specific component is ready
  const componentStatus = (latestSubmission?.components as { componentStatus?: Record<string, string> })?.componentStatus;
  
  // CRITICAL: Always rely on explicit componentStatus when available
  // Don't fallback to checking component data existence as it could be stale
  const isComponentReady = componentStatus?.[componentKey] === 'completed';
  const isComponentPending = componentStatus?.[componentKey] === 'pending';
  const isComponentFailed = componentStatus?.[componentKey] === 'failed';
  const isComponentNotRequested = componentStatus?.[componentKey] === 'not_requested';
  
  // Prefetch data on hover for faster loading (only if component is ready)
  const handleMouseEnter = () => {
    if (latestSubmission && isComponentReady) {
      // RTK Query prefetching - much simpler!
      prefetchSubmission(latestSubmission.id);
    }
  };
  
  // Handle click based on component readiness
  const handleClick = () => {
    // Special handling for Landing Page
    if (componentKey === 'landingPage') {
      if (!latestSubmission) {
        router.push('/audience-architect?generateLandingPage=true');
        return;
      }
      
      const eventFunnelStatus = componentStatus?.eventFunnel;
      const landingPageStatus = componentStatus?.landingPage;
      
      if (landingPageStatus === 'completed') {
        router.push(`${config.path}?id=${latestSubmission.id}`);
      } else if (eventFunnelStatus === 'completed' && (landingPageStatus === 'not_requested' || !landingPageStatus)) {
        router.push(`/event-funnel?submissionId=${latestSubmission.id}`);
      } else if (landingPageStatus === 'not_requested' || !landingPageStatus) {
        // Show friendly message about dependency requirement
        alert('⏳ Event Funnel Required\n\nThe Event Funnel must be completed before you can generate a Landing Page.\n\nPlease wait for the Event Funnel to finish processing, then try again.');
      } else {
        router.push('/audience-architect?generateLandingPage=true');
      }
      return;
    }
    
    // Handle other components normally
    if (!latestSubmission) {
      router.push('/audience-architect');
      return;
    }
    
    if (isComponentReady) {
      router.push(`${config.path}?id=${latestSubmission.id}`);
    } else if (isComponentPending) {
      router.push(`/results/${latestSubmission.id}`);
    } else {
      router.push('/audience-architect');
    }
  };

  // Handle retry with RTK Query mutation
  const handleRetry = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!latestSubmission) return;
    
    setIsRetrying(true);
    try {
      // Use RTK Query mutation - auto-invalidates cache!
      await retrySubmission({ submissionId: latestSubmission.id }).unwrap();
      
      // No need to reload - RTK Query will auto-refetch invalidated data
      setIsRetrying(false);
    } catch (error) {
      console.error('Retry error:', error);
      alert('Failed to retry. Please try again.');
      setIsRetrying(false);
    }
  };
  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-[var(--border)]/30 bg-[var(--card)]/40 backdrop-blur-xl"
      onClick={(e) => {
        // Don't handle card click if clicking on a button
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
          return;
        }
        handleClick();
      }}
      onMouseEnter={handleMouseEnter}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{
             background: `linear-gradient(135deg, transparent 30%, rgba(var(--accent-rgb), 0.1) 50%, transparent 70%)`,
             boxShadow: `inset 0 0 20px rgba(var(--accent-rgb), 0.1)`
           }}>
      </div>
      
      <CardHeader className="relative z-10 pb-4">
        {/* Icon and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${config.gradient} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
            <span className="text-3xl">{config.icon}</span>
            <div className="absolute inset-0 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors duration-500"></div>
          </div>
          
          {latestSubmission && (
            <div className="flex flex-col items-end space-y-1">
              {isComponentReady ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-gentle-fade shadow-lg shadow-green-500/50"></div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                    ✓ Ready
                  </div>
                </div>
              ) : isComponentPending ? (
                <div className="flex items-center space-x-2">
                  <div className="relative w-3 h-3">
                    <div className="absolute inset-0 rounded-full bg-orange-500 opacity-20 animate-smooth-pulse"></div>
                    <div className="relative w-3 h-3 rounded-full bg-orange-500 animate-gentle-fade"></div>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    ⏳ Generating
                  </div>
                </div>
              ) : isComponentFailed ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                    ✗ Failed
                  </div>
                </div>
              ) : isComponentNotRequested ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500 opacity-50"></div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                    No Submission
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500 opacity-50"></div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                    No Submission
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <CardTitle className="h3 text-[var(--text)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--accent)] group-hover:to-[var(--accent-2)] transition-all duration-300 mb-2">
          {config.title}
        </CardTitle>
        
        {/* Description */}
        <CardDescription className="text-[var(--muted)] text-sm leading-relaxed min-h-[60px]">
          {config.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        {latestSubmission ? (
          <div className="space-y-3">
            {/* Last Updated */}
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Last updated</span>
              <span className="font-medium">{new Date(latestSubmission.updatedAt).toLocaleDateString()}</span>
            </div>
            
            {/* Action Button */}
            {isComponentReady ? (
              <Button
                className={`w-full bg-gradient-to-r ${config.gradient} hover:shadow-xl hover:shadow-${config.color}-500/20 transition-all duration-300 group-hover:scale-105`}
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>View Results</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            ) : isComponentPending ? (
              <Button
                variant="outline"
                className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10 transition-all duration-300 group-hover:scale-105"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/results/${latestSubmission.id}`);
                }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400" style={{ animationDuration: '2s' }}></div>
                  <span>View Progress</span>
                </span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full border-[var(--border)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all duration-300 group-hover:scale-105"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>
                      {componentKey === 'landingPage' && isComponentNotRequested 
                        ? 'Generate Landing Page' 
                        : isComponentFailed
                        ? 'Retry Generation'
                        : 'View Status'}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
                {/* Only show retry button if component failed, not for not_requested */}
                {isComponentFailed && (
                  <Button
                    variant="ghost"
                    className="w-full text-xs text-gray-400 hover:text-orange-400 transition-colors"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isRetrying}
                  >
                    {isRetrying ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-400" style={{ animationDuration: '2s' }}></div>
                        <span>Retrying...</span>
                      </span>
                    ) : (
                      '🔄 Retry Generating'
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Empty State */}
            <div className="text-center py-4">
              <p className="text-sm text-[var(--muted)] mb-3">
                No results yet. Create your first strategy to unlock this component.
              </p>
            </div>
            
            {/* Create Button */}
            <Button
              variant="outline"
              className="w-full border-[var(--border)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all duration-300 group-hover:scale-105"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                router.push('/audience-architect?new=true');
              }}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Create Strategy</span>
                <span className="text-lg">+</span>
              </span>
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Animated particles on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 animate-ping">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} absolute top-4 right-4`}></div>
        </div>
      </div>
    </Card>
  );
}

export function SubmissionsList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [scrollY, setScrollY] = useState(0);
  
  // RTK Query hooks - automatic caching, polling, and loading states!
  const { data, isLoading, error } = useGetSubmissionsQuery({ limit: 50 });
  const [checkStale] = useCheckStaleSubmissionsMutation();
  const prefetchSubmission = usePrefetch('getSubmissionById');
  
  const submissions = data?.submissions || [];

  // Check for stale submissions on mount
  useEffect(() => {
    checkStale();
  }, [checkStale]);

  // Handle scroll for background effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get the latest submission regardless of status
  const getLatestSubmissionForComponent = () => {
    const sortedSubmissions = [...submissions]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    return sortedSubmissions[0] || null;
  };

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <FuturisticBackground scrollY={scrollY} />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="text-6xl mb-4">⚠️</div>
              <CardTitle className="text-red-500">Error Loading Dashboard</CardTitle>
              <CardDescription>
                {'message' in error ? error.message : 'Failed to load submissions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => dispatch(submissionsApi.util.invalidateTags([{ type: 'SubmissionsList', id: 'LIST' }]))} className="w-full">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasSubmissions = submissions.length > 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FuturisticBackground scrollY={scrollY} />
      
      <div className="relative z-10 pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-flex items-center space-x-2 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-2)]/10 border border-[var(--accent)]/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <span className="text-[var(--accent)] font-semibold">Dashboard</span>
            </div>
            
            <h1 className="h1 mb-6 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-2">
              Events Expert
            </h1>
            
            <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed mb-8">
              {hasSubmissions 
                ? "Access your complete marketing strategy components. Click any card to view detailed insights."
                : "Welcome! Create your first marketing strategy to unlock all five powerful components."}
            </p>

            {/* Quick Stats */}
            {hasSubmissions && (
              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--accent)]">{submissions.length}</div>
                  <div className="text-sm text-[var(--muted)]">Total Strategies</div>
                </div>
                <div className="w-px h-12 bg-[var(--border)]"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {submissions.filter(s => s.status === 'completed').length}
                  </div>
                  <div className="text-sm text-[var(--muted)]">Completed</div>
                </div>
                <div className="w-px h-12 bg-[var(--border)]"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">
                    {submissions.filter(s => s.status === 'pending').length}
                  </div>
                  <div className="text-sm text-[var(--muted)]">Generating</div>
                </div>
              </div>
            )}

            {/* Primary CTA */}
            <Button
              onClick={() => router.push('/audience-architect?new=true')}
              size="lg"
              className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] hover:shadow-2xl hover:shadow-[var(--accent)]/20 hover:scale-105 transition-all duration-300 px-8 py-6 text-lg"
            >
              <span className="flex items-center space-x-2">
                <span>✨</span>
                <span>Create New Strategy</span>
                <span>→</span>
              </span>
            </Button>
          </div>

          {/* Component Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {componentConfigs.map((config) => {
              const componentLatestSubmission = getLatestSubmissionForComponent();
              
              // Map config.id to component key
              const keyMap: Record<string, string> = {
                icp: 'audienceArchitect',
                'content-compass': 'contentCompass',
                'message-multiplier': 'messageMultiplier',
                funnel: 'eventFunnel',
                landing: 'landingPage'
              };
              const componentKey = keyMap[config.id] || config.id;
              
              return (
                <PremiumComponentCard
                  key={config.id}
                  config={config}
                  latestSubmission={componentLatestSubmission}
                  isLoading={isLoading}
                  componentKey={componentKey}
                />
              );
            })}
          </div>

          {/* Recent Activity Section */}
          {hasSubmissions && submissions.slice(0, 5).length > 0 && (
            <Card className="bg-[var(--card)]/40 backdrop-blur-xl border-[var(--border)]/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest strategy submissions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submissions
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((submission) => {
                      return (
                        <div
                          key={submission.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elev)]/50 hover:bg-[var(--bg-elev)] transition-all duration-300 cursor-pointer group"
                          onClick={() => router.push(`/results/${submission.id}`)}
                          onMouseEnter={() => {
                            if (submission.status === 'completed') {
                              // RTK Query prefetching
                              prefetchSubmission(submission.id);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl">
                              🎯
                            </div>
                            <div>
                              <h4 className="h4 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                                {submission.title || 'Marketing Strategy'}
                              </h4>
                              <p className="text-sm text-[var(--muted)]">
                                {new Date(submission.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              submission.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : submission.status === 'pending'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {submission.status}
                            </div>
                            <svg className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All History */}
          {hasSubmissions && <HistoryTable />}

          {/* Empty State with Onboarding */}
          {!hasSubmissions && (
            <Card className="bg-[var(--card)]/40 backdrop-blur-xl border-[var(--border)]/30 max-w-3xl mx-auto mt-8">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="h3 mb-4">Ready to Transform Your Marketing?</h3>
                <p className="text-[var(--muted)] mb-8 max-w-xl mx-auto">
                  In just 2 minutes, get a complete marketing strategy with all five essential components tailored to your business.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">1</div>
                    <p className="text-sm font-medium">Fill Simple Form</p>
                    <p className="text-xs text-[var(--muted)] mt-1">Target market & product info</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">2</div>
                    <p className="text-sm font-medium">AI Processes</p>
                    <p className="text-xs text-[var(--muted)] mt-1">Takes ~2 minutes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">3</div>
                    <p className="text-sm font-medium">Get Strategy</p>
                    <p className="text-xs text-[var(--muted)] mt-1">All 5 components ready</p>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/audience-architect?new=true')}
                  size="lg"
                  className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] hover:shadow-2xl hover:scale-105 transition-all duration-300 px-12 py-6 text-lg"
                >
                  Get Started Now →
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
