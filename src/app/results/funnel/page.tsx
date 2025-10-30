"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { Button } from '@/components/ui/button';
import { NewFormButton } from '@/components/ui/NewFormButton';
import { EventFunnelDisplay } from '@/components/results/EventFunnelDisplay';
import { extractComponentData, createDebugInfo } from '@/lib/component-data-utils';
import { ErrorState } from '@/components/ui/ErrorState';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGetSubmissionByIdQuery, useUpdateSubmissionContentMutation } from '@/store/api/submissionsApi';
import { formatEventFunnelText } from '@/lib/format-utils';

export default function EventFunnelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [scrollY, setScrollY] = useState(0);
  const [updateSubmissionContent, { isLoading: isSaving }] = useUpdateSubmissionContentMutation();
  
  // Get submission ID from URL
  const submissionId = searchParams.get('id');
  
  // RTK Query handles all data fetching with automatic polling
  const { data: submission, isLoading, isFetching, error } = useGetSubmissionByIdQuery(
    submissionId || '',
    { skip: !submissionId || status !== 'authenticated' }
  );

  // Extract component data and status
  const displayData = useMemo(() => {
    const extracted = extractComponentData(
      submission, 
      'event-funnel',
      ['EventFunnel', 'eventFunnel', 'the-event-funnel']
    );
    return extracted || createDebugInfo(submission, 'Event Funnel');
  }, [submission]);

  const componentStatus = useMemo(() => {
    if (!submission?.components) return null;
    const status = (submission.components as { componentStatus?: Record<string, string> })?.componentStatus;
    return status?.eventFunnel;
  }, [submission]);

  // Update handler
  const handleUpdate = async (updatedData: Record<string, unknown>) => {
    if (!submission?.id) {
      throw new Error('No submission ID found');
    }
    
    const components = (submission.components as Record<string, unknown>) || {};
    const updatedComponents = {
      ...components,
      eventFunnel: updatedData
    };
    
    try {
      await updateSubmissionContent({
        id: submission.id,
        components: updatedComponents,
        output: formatEventFunnelText(updatedData),
      }).unwrap();
    } catch (error) {
      console.error('[EventFunnel] Failed to save:', error);
      throw error;
    }
  };

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth loading
  if (status === 'loading') {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto"></div>
        </div>
      </AppLayout>
    );
  }

  // Not authenticated
  if (!session) {
    return null;
  }

  // Loading
  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
            <p className="text-[var(--muted)]">Loading Event Funnel...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error
  if (error || !submission) {
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? (error as { message?: string }).message 
      : 'Failed to load data';
    return (
      <AppLayout>
        <ErrorState error={errorMessage || 'Failed to load'} componentName="Event Funnel" icon="🎯" scrollY={scrollY} />
      </AppLayout>
    );
  }

  // Check if component is pending or not requested
  if (componentStatus === 'pending') {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background relative">
          <FuturisticBackground scrollY={scrollY} />
          <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-lg">
              <div className="mb-6">
                <div className="inline-flex p-6 rounded-full bg-orange-500/20 border border-orange-400/50">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-400"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Generating Event Funnel...</h2>
              <p className="text-[var(--muted)] mb-6">
                We're creating your customized event funnel strategy. This usually takes 30-60 seconds.
              </p>
              <Button onClick={() => router.push(`/results/${submission.id}`)} variant="outline">
                ← Back to Strategy Overview
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background relative">
        <FuturisticBackground scrollY={scrollY} />
        
        {/* Polling Indicator */}
        {isFetching && (
          <div className="fixed top-20 right-6 z-50 bg-orange-500/20 border border-orange-400/50 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
              <span className="text-sm text-orange-300">Checking for updates...</span>
            </div>
          </div>
        )}
        
        <div className="relative z-10 pt-20 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <Button 
                onClick={() => router.push(`/results/${submission.id}`)}
                variant="outline"
                className="mb-4"
              >
                ← Back to Strategy Overview
              </Button>
              <NewFormButton variant="outline" className="mb-4" />
            </div>

            {/* Event Funnel Display */}
            <EventFunnelDisplay 
              data={displayData}
              inputs={submission.inputs as Record<string, unknown>}
              onUpdate={handleUpdate}
              isUpdating={isSaving}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
