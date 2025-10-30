"use client";

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OfferPromptDisplay } from '@/components/results/OfferPromptDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OfferPromptModal } from '@/components/forms/OfferPromptModal';
import { BrodysBrain } from '@/components/ui/BrodysBrain';
import { useGetSubmissionsQuery, useGetSubmissionByIdQuery, useUpdateSubmissionContentMutation, usePrefetch } from '@/store/api/submissionsApi';
import type { FormSubmissionData } from '@/lib/storage';
import { formatOfferPromptText } from '@/lib/format-utils';

export default function OfferResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status: authStatus } = useSession();
  const [updateSubmissionContent, { isLoading: isSaving }] = useUpdateSubmissionContentMutation();
  const prefetchSubmission = usePrefetch('getSubmissionById');
  const [showOfferModal, setShowOfferModal] = useState(false);
  
  // Get submission ID from URL query parameter
  const submissionId = searchParams.get('id');
  
  // Fetch all offer submissions for history
  const { data: submissionsData, isLoading: isLoadingList } = useGetSubmissionsQuery(
    { kind: 'offer', limit: 50 },
    { skip: authStatus !== 'authenticated' }
  );
  const offerSubmissions = submissionsData?.submissions || [];
  
  // Fetch specific submission if ID is provided
  const { data: currentSubmission, isLoading: isLoadingCurrent } = useGetSubmissionByIdQuery(
    submissionId || '',
    { skip: !submissionId || authStatus !== 'authenticated' }
  );
  
  // Extract offer prompt content from current submission
  const content = useMemo(() => {
    if (!currentSubmission?.components) return null;
    const offerPayload = (currentSubmission.components as Record<string, unknown>)?.offerPrompt as Record<string, unknown> | undefined;
    return (offerPayload?.content as Record<string, unknown>) || null;
  }, [currentSubmission]);

  // Handler to update submission content when inline edits are made
  const handleUpdate = async (updatedData: Record<string, unknown>) => {
    if (!submissionId) {
      throw new Error('No submission ID found');
    }
    
    // The offer prompt data is stored in components.offerPrompt
    const updatedComponents = {
      offerPrompt: { content: updatedData }
    };
    
    try {
      // Save via API with formatted text as output
      await updateSubmissionContent({
        id: submissionId,
        components: updatedComponents,
        output: formatOfferPromptText(updatedData),
      }).unwrap();
      
      console.log('[OfferPrompt] Successfully saved changes');
    } catch (error) {
      console.error('[OfferPrompt] Failed to save changes:', error);
      throw error; // Re-throw to trigger error handling in InlineEditableContent
    }
  };

  const handleViewSubmission = (submission: FormSubmissionData) => {
    // Prefetch submission data for instant navigation
    prefetchSubmission(submission.id, { force: true });
    
    // Navigate with submission ID as query parameter
    router.push(`/results/offer?id=${submission.id}`);
    
    // Smooth scroll to content section
    setTimeout(() => {
      const el = document.getElementById('offer-content');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const isLoading = isLoadingList || isLoadingCurrent;

  const page = (
    <div className="min-h-screen bg-background relative overflow-hidden px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-4 mb-6 sm:mb-8 text-center">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">Offer Prompts</h1>
            <p className="text-sm sm:text-base text-[var(--muted)] mt-1">Create and revisit elegantly crafted offer prompts</p>
          </div>
        </div>

        {/* Generate New Offer Prompt Button - Always visible at the top */}
        {offerSubmissions.length > 0 && (
          <div className="flex justify-center mb-10">
            <Button 
              onClick={() => router.push('/offer-prompt')}
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg hover:shadow-pink-500/30 transition-all duration-300 px-6 py-3"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Generate New Offer Prompt
            </Button>
          </div>
        )}

        {/* Past Offer Prompts */}
        {!isLoadingList && offerSubmissions.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold text-[var(--text)]">Past Offer Prompts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offerSubmissions.map((submission) => {
                const offerPayload = (submission.components as Record<string, unknown>)?.offerPrompt as Record<string, unknown> | undefined;
                const content = (offerPayload?.content as Record<string, unknown>) || {};
                const title = (content.title as string) || submission.title || 'Untitled Offer Prompt';
                const isActive = submission.id === submissionId;
                
                return (
                  <Card 
                    key={submission.id} 
                    className={`bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                      isActive 
                        ? 'border-pink-500/70 shadow-pink-500/30 ring-2 ring-pink-500/50' 
                        : 'border-pink-500/30 hover:border-pink-500/50 hover:shadow-pink-500/20'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg">
                          <span className="text-xl">💡</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-base leading-relaxed line-clamp-2 mb-1">{title}</CardTitle>
                          <CardDescription className="text-xs text-gray-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(submission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleViewSubmission(submission)}
                          disabled={isActive}
                          className={`flex-1 bg-gradient-to-r from-pink-500/10 to-violet-500/10 border-pink-500/30 hover:border-pink-500/50 hover:bg-pink-500/20 text-pink-300 hover:text-pink-200 transition-all ${
                            isActive ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {isActive ? 'Viewing' : 'View'}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => router.push('/dashboard')}
                          className="flex-1 text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Dashboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Content */}
        {isLoading ? (
          <Card className="bg-[var(--card)]/80 backdrop-blur-xl border-[var(--border)]/50 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
              </div>
            </CardContent>
          </Card>
        ) : !content ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">

            {/* Heading */}
            {offerSubmissions.length === 0 ? (
              <div className="text-center mb-8 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                  Ready to Create Your First Offer?
                </h2>
                <p className="text-lg text-[var(--muted)] max-w-md text-center mx-auto">
                  Craft a compelling offer prompt that converts
                </p>
              </div>
            ) : null}

            {/* Generate Offer Prompt Button and Back Link - Only shown when there are no submissions */}
            {offerSubmissions.length === 0 && (
              <div className="flex flex-col items-center gap-4">
                <Button 
                  onClick={() => router.push('/offer-prompt')}
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg hover:shadow-pink-500/30 transition-all duration-300 px-6 py-3"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Generate Offer Prompt
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  ← Back to Dashboard
                </Button>
              </div>
            )}

            {/* Back Link - Shown when there are submissions but no content selected */}
            {offerSubmissions.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  ← Back to Dashboard
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div id="offer-content">
            <OfferPromptDisplay 
              data={content}
              onUpdate={handleUpdate}
              isUpdating={isSaving}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <AppLayout>{page}</AppLayout>
      <OfferPromptModal isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} />
      <BrodysBrain />
    </>
  );
}
