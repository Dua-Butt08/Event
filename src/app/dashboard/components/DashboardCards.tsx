"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetSubmissionsQuery, usePrefetch } from '@/store/api/submissionsApi';
import type { FormSubmissionData } from "@/lib/storage";

// Component configurations
const componentConfigs = [
  {
    id: 'audience-architect',
    title: 'Audience Architect™',
    description: 'Deep insights into your ideal customer profile, demographics, pain points, and behavioral patterns.',
    icon: '🎯',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    path: '/results/icp',
    componentKey: 'audienceArchitect',
    formPath: '/audience-architect'
  },
  {
    id: 'content-compass',
    title: 'Content Compass™',
    description: 'Strategic content roadmap with topics, formats, and distribution channels tailored to your audience.',
    icon: '🧭',
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    path: '/results/content-compass',
    componentKey: 'contentCompass',
    formPath: '/audience-architect'
  },
  {
    id: 'message-multiplier',
    title: 'Message Multiplier™',
    description: 'Compelling messaging framework with value propositions and communication strategies.',
    icon: '💬',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    path: '/results/message-multiplier',
    componentKey: 'messageMultiplier',
    formPath: '/audience-architect'
  },
  {
    id: 'event-funnel',
    title: 'Event Funnel',
    description: 'Complete customer journey mapping with touchpoints, events, and conversion optimization.',
    icon: '🌊',
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    path: '/results/funnel',
    componentKey: 'eventFunnel',
    formPath: '/event-funnel'
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'High-converting landing page blueprint with copy, design, and optimization recommendations.',
    icon: '🚀',
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    path: '/results/landing',
    componentKey: 'landingPage',
    formPath: '/event-funnel'
  },
  {
    id: 'offer-prompt',
    title: 'Offer Prompt',
    description: 'Compelling offer creation with structured prompts and persuasive frameworks.',
    icon: '💡',
    color: 'yellow',
    gradient: 'from-yellow-500 to-yellow-600',
    path: '/results/offer',
    componentKey: 'offerPrompt',
    formPath: '/offer-prompt'
  }
];

interface ComponentCardProps {
  config: typeof componentConfigs[0];
  latestSubmission: FormSubmissionData | null;
  latestOfferSubmission: FormSubmissionData | null;
}

function ComponentCard({ config, latestSubmission, latestOfferSubmission }: ComponentCardProps) {
  const router = useRouter();
  const prefetchSubmission = usePrefetch('getSubmissionById');
  
  // For Offer Prompt, we use the latest offer submission
  const relevantSubmission = config.id === 'offer-prompt' ? latestOfferSubmission : latestSubmission;
  
  // Check component status
  const componentStatus = (relevantSubmission?.components as { componentStatus?: Record<string, string> })?.componentStatus;
  const isComponentReady = componentStatus?.[config.componentKey] === 'completed';
  const isComponentPending = componentStatus?.[config.componentKey] === 'pending';
  const isComponentFailed = componentStatus?.[config.componentKey] === 'failed';
  const isComponentNotRequested = componentStatus?.[config.componentKey] === 'not_requested';
  
  // Prefetch data on hover for faster loading
  const handleMouseEnter = () => {
    if (relevantSubmission && isComponentReady) {
      prefetchSubmission(relevantSubmission.id);
    }
  };
  
  // Handle click based on component readiness
  const handleClick = () => {
    // Special handling for Landing Page
    if (config.id === 'landing-page') {
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
    
    // Handle Offer Prompt
    if (config.id === 'offer-prompt') {
      if (latestOfferSubmission) {
        router.push(`${config.path}?id=${latestOfferSubmission.id}`);
      } else {
        router.push(config.formPath);
      }
      return;
    }
    
    // Handle other components
    if (!latestSubmission) {
      router.push(config.formPath);
      return;
    }
    
    if (isComponentReady) {
      router.push(`${config.path}?id=${latestSubmission.id}`);
    } else if (isComponentPending) {
      router.push(`/results/${latestSubmission.id}`);
    } else {
      router.push(config.formPath);
    }
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer border-[var(--border)]/30 bg-[var(--card)]/40 backdrop-blur-xl"
      onClick={handleClick}
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
          
          {relevantSubmission && (
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
        {relevantSubmission ? (
          <div className="space-y-3">
            {/* Last Updated */}
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Last updated</span>
              <span className="font-medium">{new Date(relevantSubmission.updatedAt).toLocaleDateString()}</span>
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
                  router.push(`/results/${relevantSubmission.id}`);
                }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400" style={{ animationDuration: '2s' }}></div>
                  <span>View Progress</span>
                </span>
              </Button>
            ) : (
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
                    {config.id === 'landing-page' && isComponentNotRequested 
                      ? 'Generate Landing Page' 
                      : isComponentFailed
                      ? 'Retry Generation'
                      : 'Create/View'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
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
                router.push(config.formPath);
              }}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Create</span>
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

export function DashboardCards() {
  // RTK Query hooks
  const { data: submissionsData } = useGetSubmissionsQuery({ limit: 50 });
  const { data: offerSubmissionsData } = useGetSubmissionsQuery({ kind: 'offer', limit: 1 });
  
  const submissions = submissionsData?.submissions || [];
  const offerSubmissions = offerSubmissionsData?.submissions || [];
  
  // Get the latest submission regardless of status
  const getLatestSubmission = () => {
    const sortedSubmissions = [...submissions]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    return sortedSubmissions[0] || null;
  };
  
  const latestSubmission = getLatestSubmission();
  const latestOfferSubmission = offerSubmissions[0] || null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {componentConfigs.map((config) => (
        <ComponentCard
          key={config.id}
          config={config}
          latestSubmission={latestSubmission}
          latestOfferSubmission={latestOfferSubmission}
        />
      ))}
    </div>
  );
}