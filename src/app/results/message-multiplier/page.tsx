"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { NewFormButton } from '@/components/ui/NewFormButton';
import { MessageMultiplierDisplay } from '@/components/results/MessageMultiplierDisplay';
import { ErrorState } from '@/components/ui/ErrorState';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGetSubmissionByIdQuery, useUpdateSubmissionContentMutation } from '@/store/api/submissionsApi';
import { formatMessageMultiplierText } from '@/lib/format-utils';
import { getComponentStatus } from '@/lib/component-status-utils';

export default function MessageMultiplierPage() {
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

  // Extract and normalize component data
  const displayData = useMemo(() => {
    if (!submission?.components) {
      console.log('[MessageMultiplier] No components in submission');
      return null;
    }

    const components = submission.components as Record<string, unknown>;
    console.log('[MessageMultiplier] Available component keys:', Object.keys(components));

    // Try multiple possible keys for message multiplier data
    const possibleKeys = [
      'messageMultiplier',
      'MessageMultiplier', 
      'the-message-multiplier',
      'message-multiplier',
      'content-expander',
      'contentExpander'
    ];

    let rawData: unknown = null;

    for (const key of possibleKeys) {
      if (components[key]) {
        rawData = components[key];
        console.log('[MessageMultiplier] Found data at key:', key);
        break;
      }
    }

    if (!rawData) {
      console.log('[MessageMultiplier] No message multiplier data found in components');
      return null;
    }

    // Unwrap if needed
    let data = rawData as Record<string, unknown>;

    // Handle assistant/content wrapper
    if (data.role === 'assistant' && data.content && typeof data.content === 'object') {
      console.log('[MessageMultiplier] Unwrapping assistant/content wrapper');
      data = data.content as Record<string, unknown>;
    }

    // Handle payload wrapper
    if (data.payload && typeof data.payload === 'object' && !data.sub_topics && !data.topics && !data.milestone) {
      console.log('[MessageMultiplier] Unwrapping payload wrapper');
      data = data.payload as Record<string, unknown>;
    }
    
    // Handle content wrapper without role
    if (data.content && typeof data.content === 'object' && !data.sub_topics && !data.topics && !data.milestone) {
      console.log('[MessageMultiplier] Unwrapping content wrapper');
      data = data.content as Record<string, unknown>;
    }

    // Log final structure
    console.log('[MessageMultiplier] Final data structure:', {
      hasSubTopics: !!data.sub_topics,
      subTopicsLength: Array.isArray(data.sub_topics) ? data.sub_topics.length : 0,
      hasTopics: !!data.topics,
      topicsLength: Array.isArray(data.topics) ? data.topics.length : 0,
      hasMilestone: !!data.milestone,
      hasPersona: !!data.persona,
      hasHeader: !!data.header,
      topLevelKeys: Object.keys(data).slice(0, 10)
    });

    return data;
  }, [submission]);

  // Update handler
  const handleUpdate = async (updatedData: Record<string, unknown>) => {
    if (!submission?.id) {
      throw new Error('No submission ID found');
    }
    
    const components = (submission.components as Record<string, unknown>) || {};
    const updatedComponents = {
      ...components,
      messageMultiplier: updatedData
    };
    
    try {
      await updateSubmissionContent({
        id: submission.id,
        components: updatedComponents,
        output: formatMessageMultiplierText(updatedData),
      }).unwrap();
    } catch (error) {
      console.error('[MessageMultiplier] Failed to save:', error);
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
            <p className="text-[var(--muted)]">Loading Message Multiplier...</p>
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
        <ErrorState error={errorMessage || 'Failed to load'} componentName="Message Multiplier™" icon="💡" scrollY={scrollY} />
      </AppLayout>
    );
  }

  // No data found - check if it was requested or not
  if (!displayData) {
    // Check component status to differentiate scenarios
    const componentStatus = getComponentStatus(submission.components, 'messageMultiplier');
    const wasRequested = componentStatus !== null && componentStatus !== 'not_requested';
    
    console.log('[MessageMultiplier] No data found. Status:', componentStatus, 'Was requested:', wasRequested);
    
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="relative z-10 pt-20 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
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

              {wasRequested ? (
                <ErrorState 
                  error="Message Multiplier generation failed" 
                  componentName="Message Multiplier™" 
                  icon="💬" 
                  scrollY={scrollY} 
                />
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-6">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[var(--text)] mb-4">Message Multiplier™ Not Generated</h2>
                  <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
                    This component was not included in your original request.
                  </p>
                  <Button 
                    onClick={() => router.push(`/results/${submission.id}`)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Back to Strategy Overview
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
        {/* Simplified background - no WebGL */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Polling Indicator */}
        {isFetching && (
          <div className="fixed top-20 right-6 z-50 bg-purple-500/20 border border-purple-400/50 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
              <span className="text-sm text-purple-300">Checking for updates...</span>
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

            {/* Message Multiplier Display */}
            <MessageMultiplierDisplay 
              data={displayData}
              inputs={submission.inputs as Record<string, unknown>}
              onUpdate={handleUpdate}
              isUpdating={isSaving}
              submissionId={submission.id}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
