"use client";

import { useState, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGetSubmissionByIdQuery, useGetSubmissionsQuery } from '@/store/api/submissionsApi';

// Component status type
type ComponentStatus = 'pending' | 'completed' | 'failed' | 'not_requested';
type ComponentStatusMap = Record<string, ComponentStatus>;

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    isResultPage: false,
    componentKey: null
  },
  {
    href: '/dashboard/history',
    label: 'History',
    icon: '📜',
    isResultPage: false,
    componentKey: null
  },
  {
    href: '/audience-architect',
    label: 'Audience Architect™',
    icon: '🎯',
    isResultPage: true,
    resultHref: '/results/icp',
    componentKey: 'audienceArchitect'
  },
  {
    href: '/results/content-compass',
    label: 'Content Compass™',
    icon: '🗺️',
    isResultPage: true,
    componentKey: 'contentCompass'
  },
  {
    href: '/results/message-multiplier',
    label: 'Message Multiplier™',
    icon: '💡',
    isResultPage: true,
    componentKey: 'messageMultiplier'
  },
  {
    href: '/results/funnel',
    label: 'Event Funnel',
    icon: '🎯',
    isResultPage: true,
    componentKey: 'eventFunnel'
  },
  {
    href: '/results/landing',
    label: 'Landing Page',
    icon: '🚀',
    isResultPage: true,
    componentKey: 'landingPage'
  },
  {
    href: '/results/offer',
    label: 'Offer Prompt',
    icon: '💼',
    isResultPage: true,
    componentKey: 'offerPrompt' // Add componentKey for status tracking
  }
];

interface SidebarProps {
  className?: string;
}

/**
 * Extract submission ID from URL
 * Follows the Sidebar ID Detection Strategy from memory
 */
function useSubmissionIdFromUrl(): string | null {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // First check query parameter
  const idParam = searchParams.get('id');
  if (idParam) return idParam;
  
  // Then check path segment (but exclude known component slugs)
  const componentSlugs = new Set(['icp', 'content-compass', 'message-multiplier', 'funnel', 'landing', 'offer']);
  const pathParts = pathname.split('/').filter(Boolean);
  const pathSegment = pathParts[0] === 'results' ? pathParts[1] : null;
  
  if (pathSegment && !componentSlugs.has(pathSegment)) {
    return pathSegment;
  }
  
  return null;
}

// Status indicator component
const StatusIndicator = ({ status }: { status: 'ready' | 'pending' | 'failed' | 'not-ready' }) => {
  const baseClasses = "relative w-2.5 h-2.5";
  
  if (status === 'ready') {
    return (
      <div className={baseClasses} title="Ready">
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-smooth-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-400 to-green-500 shadow-lg shadow-green-500/60 animate-gentle-fade"></div>
      </div>
    );
  }
  
  if (status === 'pending') {
    return (
      <div className={baseClasses} title="Generating">
        <div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 animate-smooth-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 shadow-lg shadow-orange-500/60">
          <div className="w-full h-full rounded-full animate-spin" style={{ 
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            animationDuration: '3s'
          }}></div>
        </div>
      </div>
    );
  }
  
  if (status === 'failed') {
    return (
      <div className={baseClasses} title="Failed">
        <div className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-gentle-breathe"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-400 to-red-600 shadow-lg shadow-red-500/70"></div>
      </div>
    );
  }
  
  // not-ready
  return (
    <div className={baseClasses} title="No Submission">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-400 to-gray-500 opacity-40"></div>
    </div>
  );
};

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Get submission ID from URL using reliable extraction logic
  const submissionId = useSubmissionIdFromUrl();
  
  // Fetch submission data using RTK Query (with automatic polling)
  const { data: submission } = useGetSubmissionByIdQuery(submissionId || '', {
    skip: !submissionId,
  });
  
  // Fetch latest submissions for dashboard view (when no specific submission ID)
  const { data: submissionsData } = useGetSubmissionsQuery(
    { limit: 1 },
    { skip: !!submissionId } // Only fetch when no submission ID in URL
  );
  
  // Fetch latest offer submissions for Offer Prompt status
  const { data: offerSubmissionsData } = useGetSubmissionsQuery(
    { kind: 'offer', limit: 1 },
    { } // Always fetch to show Offer Prompt status
  );
  
  // Use either the specific submission or the latest one
  const activeSubmission = submission || submissionsData?.submissions?.[0] || null;
  const latestOfferSubmission = offerSubmissionsData?.submissions?.[0] || null;
  
  // Extract component status map
  const componentStatus = useMemo((): ComponentStatusMap => {
    if (!activeSubmission?.components) return {};
    return (activeSubmission.components as { componentStatus?: ComponentStatusMap })?.componentStatus || {};
  }, [activeSubmission]);

  // Navigation handler
  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    e.preventDefault();
    
    // Dashboard & History - always navigate
    if (!item.isResultPage) {
      router.push(item.href);
      return;
    }
    
    // Offer Prompt - special handling (separate submission type)
    if (item.componentKey === 'offerPrompt') {
      router.push('/results/offer');
      return;
    }
    
    // No submission - go to form
    if (!activeSubmission) {
      router.push('/audience-architect');
      return;
    }
    
    // Landing Page - navigate to event funnel form
    if (item.componentKey === 'landingPage') {
      const landingPageStatus = componentStatus.landingPage;
      const eventFunnelStatus = componentStatus.eventFunnel;
      
      if (landingPageStatus === 'completed') {
        router.push(`${item.href}?id=${activeSubmission.id}`);
      } else if (eventFunnelStatus === 'completed' && (!landingPageStatus || landingPageStatus === 'not_requested')) {
        router.push(`/event-funnel?submissionId=${activeSubmission.id}`);
      } else {
        router.push('/audience-architect?generateLandingPage=true');
      }
      return;
    }
    
    // Other components - check if data exists
    if (item.componentKey) {
      const status = componentStatus[item.componentKey];
      const hasData = !!(activeSubmission.components as Record<string, unknown>)?.[item.componentKey];
      const targetHref = 'resultHref' in item ? item.resultHref : item.href;
      
      if (status === 'completed' && hasData) {
        router.push(`${targetHref}?id=${activeSubmission.id}`);
      } else {
        router.push(`/results/${activeSubmission.id}`);
      }
    }
  };

  // Get status indicator for navigation item
  const getComponentStatus = (item: typeof navItems[0]): 'ready' | 'pending' | 'failed' | 'not-ready' | null => {
    if (!item.componentKey) return null;
    
    // Offer Prompt - special handling
    if (item.componentKey === 'offerPrompt') {
      // If we're on the offer results page but no specific submission is selected, show not-ready
      if (pathname === '/results/offer' && !submissionId) {
        return 'not-ready';
      }
      
      // If we're on the offer results page with a specific submission selected, show that submission's status
      if (pathname.startsWith('/results/offer') && submissionId) {
        // Find the specific submission
        const specificSubmission = offerSubmissionsData?.submissions?.find(sub => sub.id === submissionId);
        if (specificSubmission) {
          if (specificSubmission.status === 'completed') return 'ready';
          if (specificSubmission.status === 'pending') return 'pending';
          if (specificSubmission.status === 'failed') return 'failed';
        }
        return 'not-ready';
      }
      
      // If we're not on the offer results page, check for any existing submissions
      if (!latestOfferSubmission) return 'not-ready';
      
      // Offer submissions have status directly on the submission
      if (latestOfferSubmission.status === 'completed') return 'ready';
      if (latestOfferSubmission.status === 'pending') return 'pending';
      if (latestOfferSubmission.status === 'failed') return 'failed';
      return 'not-ready';
    }
    
    if (!activeSubmission) return 'not-ready';
    
    const status = componentStatus[item.componentKey];
    
    if (!status) return 'not-ready';
    if (status === 'completed') return 'ready';
    if (status === 'pending') return 'pending';
    if (status === 'failed') return 'failed';
    return 'not-ready';
  };

  return (
    <aside className={`bg-background border-r border-border ${className}`}>
      <div className="p-6 pt-32">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            const status = getComponentStatus(item);
            
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-bg-muted cursor-pointer ${
                  isActive 
                    ? 'bg-accent/10 text-accent border border-accent/20' 
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </div>
                
                {status && (
                  <div className="flex items-center">
                    <StatusIndicator status={status} />
                  </div>
                )}
              </a>
            );
          })}
        </nav>
        
        {/* Status Legend */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <StatusIndicator status="ready" />
              <span>Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIndicator status="pending" />
              <span>Generating</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIndicator status="failed" />
              <span>Failed</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <StatusIndicator status="not-ready" />
              <span>No Submission</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Get submission ID from URL
  const submissionId = useSubmissionIdFromUrl();
  
  // Fetch submission data using RTK Query
  const { data: submission } = useGetSubmissionByIdQuery(submissionId || '', {
    skip: !submissionId,
  });
  
  // Fetch latest submissions for dashboard view (when no specific submission ID)
  const { data: submissionsData } = useGetSubmissionsQuery(
    { limit: 1 },
    { skip: !!submissionId } // Only fetch when no submission ID in URL
  );
  
  // Fetch latest offer submissions for Offer Prompt status
  const { data: offerSubmissionsData } = useGetSubmissionsQuery(
    { kind: 'offer', limit: 1 },
    { } // Always fetch to show Offer Prompt status
  );
  
  // Use either the specific submission or the latest one
  const activeSubmission = submission || submissionsData?.submissions?.[0] || null;
  const latestOfferSubmission = offerSubmissionsData?.submissions?.[0] || null;
  
  // Extract component status map
  const componentStatus = useMemo((): ComponentStatusMap => {
    if (!activeSubmission?.components) return {};
    return (activeSubmission.components as { componentStatus?: ComponentStatusMap })?.componentStatus || {};
  }, [activeSubmission]);

  // Navigation handler (same as desktop)
  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Dashboard & History - always navigate
    if (!item.isResultPage) {
      router.push(item.href);
      return;
    }
    
    if (item.componentKey === 'offerPrompt') {
      router.push('/results/offer');
      return;
    }
    
    if (!activeSubmission) {
      router.push('/audience-architect');
      return;
    }
    
    if (item.componentKey === 'landingPage') {
      const landingPageStatus = componentStatus.landingPage;
      const eventFunnelStatus = componentStatus.eventFunnel;
      
      if (landingPageStatus === 'completed') {
        router.push(`${item.href}?id=${activeSubmission.id}`);
      } else if (eventFunnelStatus === 'completed' && (!landingPageStatus || landingPageStatus === 'not_requested')) {
        router.push(`/event-funnel?submissionId=${activeSubmission.id}`);
      } else {
        router.push('/audience-architect?generateLandingPage=true');
      }
      return;
    }
    
    if (item.componentKey) {
      const status = componentStatus[item.componentKey];
      const hasData = !!(activeSubmission.components as Record<string, unknown>)?.[item.componentKey];
      const targetHref = 'resultHref' in item ? item.resultHref : item.href;
      
      if (status === 'completed' && hasData) {
        router.push(`${targetHref}?id=${activeSubmission.id}`);
      } else {
        router.push(`/results/${activeSubmission.id}`);
      }
    }
  };

  // Get status indicator for navigation item
  const getComponentStatus = (item: typeof navItems[0]): 'ready' | 'pending' | 'failed' | 'not-ready' | null => {
    if (!item.componentKey) return null;
    
    // Offer Prompt - special handling
    if (item.componentKey === 'offerPrompt') {
      // If we're on the offer results page but no specific submission is selected, show not-ready
      if (pathname === '/results/offer' && !submissionId) {
        return 'not-ready';
      }
      
      // If we're on the offer results page with a specific submission selected, show that submission's status
      if (pathname.startsWith('/results/offer') && submissionId) {
        // Find the specific submission
        const specificSubmission = offerSubmissionsData?.submissions?.find(sub => sub.id === submissionId);
        if (specificSubmission) {
          if (specificSubmission.status === 'completed') return 'ready';
          if (specificSubmission.status === 'pending') return 'pending';
          if (specificSubmission.status === 'failed') return 'failed';
        }
        return 'not-ready';
      }
      
      // If we're not on the offer results page, check for any existing submissions
      if (!latestOfferSubmission) return 'not-ready';
      
      // Offer submissions have status directly on the submission
      if (latestOfferSubmission.status === 'completed') return 'ready';
      if (latestOfferSubmission.status === 'pending') return 'pending';
      if (latestOfferSubmission.status === 'failed') return 'failed';
      return 'not-ready';
    }
    
    if (!activeSubmission) return 'not-ready';
    
    const status = componentStatus[item.componentKey];
    
    if (!status) return 'not-ready';
    if (status === 'completed') return 'ready';
    if (status === 'pending') return 'pending';
    if (status === 'failed') return 'failed';
    return 'not-ready';
  };

  return (
    <>
      {/* Dashboard Menu Button - LEFT SIDE - Only on mobile/tablet (< lg) */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-[60]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h7M4 10h7m7 4h7m-7 4h7M4 14h7m7-8h7"
            />
          )}
        </svg>
      </Button>

      {/* Mobile Overlay - Only on mobile/tablet (< lg) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Only on mobile/tablet (< lg) */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-background border-r border-border z-[60] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-32">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              const status = getComponentStatus(item);
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-bg-muted cursor-pointer ${
                    isActive 
                      ? 'bg-accent/10 text-accent border border-accent/20' 
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </div>
                  
                  {status && (
                    <div className="flex items-center">
                      <StatusIndicator status={status} />
                    </div>
                  )}
                </a>
              );
            })}
          </nav>
          
          {/* Status Legend */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <StatusIndicator status="ready" />
                <span>Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIndicator status="pending" />
                <span>Generating</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIndicator status="failed" />
                <span>Failed</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <StatusIndicator status="not-ready" />
                <span>No Submission</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
