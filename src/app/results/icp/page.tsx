"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { Button } from '@/components/ui/button';
import { NewFormButton } from '@/components/ui/NewFormButton';
import { AudienceArchitectDisplay } from '@/components/results/AudienceArchitectDisplay';
import { extractComponentData, createDebugInfo } from '@/lib/component-data-utils';
import { ErrorState } from '@/components/ui/ErrorState';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGetSubmissionByIdQuery, useUpdateSubmissionContentMutation } from '@/store/api/submissionsApi';
import { formatAudienceArchitectText } from '@/lib/format-utils';

export default function ICPResultsPage() {
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

  // Extract component data using useMemo for performance
  const displayData = useMemo(() => {
    const extracted = extractComponentData(
      submission, 
      'audience-architect',
      ['AudienceArchitect', 'audienceArchitect', 'the-audience-architect']
    );
    return extracted || createDebugInfo(submission, 'Audience Architect');
  }, [submission]);

  // Update handler for inline edits
  const handleUpdate = async (updatedData: Record<string, unknown>) => {
    if (!submission?.id) {
      throw new Error('No submission ID found');
    }
    
    const components = (submission.components as Record<string, unknown>) || {};
    const updatedComponents = {
      ...components,
      audienceArchitect: updatedData
    };
    
    try {
      await updateSubmissionContent({
        id: submission.id,
        components: updatedComponents,
        output: formatAudienceArchitectText(updatedData),
      }).unwrap();
    } catch (error) {
      console.error('[AudienceArchitect] Failed to save:', error);
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

  // Auth loading state
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

  // Loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
            <p className="text-[var(--muted)]">Loading Audience Architect...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error || !submission) {
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? (error as { message?: string }).message 
      : 'Failed to load data';
    return (
      <AppLayout>
        <ErrorState error={errorMessage || 'Failed to load'} componentName="Audience Architect™" icon="🎯" scrollY={scrollY} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background relative">
        <FuturisticBackground scrollY={scrollY} />
        
        {/* Polling Indicator */}
        {isFetching && (
          <div className="fixed top-20 right-6 z-50 bg-blue-500/20 border border-blue-400/50 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span className="text-sm text-blue-300">Checking for updates...</span>
            </div>
          </div>
        )}
        
        <div className="relative z-10 pt-20 pb-20 px-6 min-h-screen">
          <div className="max-w-4xl mx-auto w-full">
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

            {/* Audience Architect Display with inline editing */}
            <AudienceArchitectDisplay 
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
