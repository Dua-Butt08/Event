import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FormSubmissionData } from '@/lib/storage';

/**
 * RTK Query API for submissions
 * Provides automatic caching, request deduplication, and loading states
 */

interface SubmissionsQueryParams {
  limit?: number;
  offset?: number;
  kind?: string;
  status?: string;
}

interface SubmissionsResponse {
  submissions: FormSubmissionData[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface RetrySubmissionRequest {
  submissionId: string;
}

interface RetrySubmissionResponse {
  success: boolean;
  message?: string;
}

export const submissionsApi = createApi({
  reducerPath: 'submissionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  
  // Tag types for cache invalidation
  tagTypes: ['Submission', 'SubmissionsList'],
  
  // Endpoints
  endpoints: (builder) => ({
    // Get all submissions with filtering
    getSubmissions: builder.query<SubmissionsResponse, SubmissionsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params && params.limit) searchParams.set('limit', String(params.limit));
        if (params && params.offset) searchParams.set('offset', String(params.offset));
        if (params && params.kind && params.kind !== 'all') searchParams.set('kind', params.kind);
        if (params && params.status && params.status !== 'all') searchParams.set('status', params.status);
        
        return `/submissions?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.submissions.map(({ id }) => ({ type: 'Submission' as const, id })),
              { type: 'SubmissionsList' as const, id: 'LIST' },
            ]
          : [{ type: 'SubmissionsList' as const, id: 'LIST' }],
      
      // Keep cache for 30 minutes for completed submissions
      keepUnusedDataFor: 1800,
      
      // Automatically refetch when there are pending submissions
      // This uses polling based on the data returned
      async onCacheEntryAdded(
        _arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        try {
          // Wait for the initial query to resolve
          await cacheDataLoaded;
          
          // Get the cached data to check for pending submissions
          const { data } = await cacheDataLoaded;
          
          const hasPending = data.submissions.some(s => s.status === 'pending');
          
          if (hasPending) {
            // Poll every 10 seconds if there are pending submissions
            const interval = setInterval(() => {
              // Trigger a re-fetch by dispatching the query again
              dispatch(submissionsApi.util.invalidateTags([{ type: 'SubmissionsList', id: 'LIST' }]));
            }, 10000);
            
            // Clean up the interval when the cache entry is removed
            await cacheEntryRemoved;
            clearInterval(interval);
          }
        } catch {
          // If cacheEntryRemoved resolves before cacheDataLoaded, do nothing
        }
      },
    }),

    // Get a single submission by ID with automatic polling for pending submissions
    getSubmissionById: builder.query<FormSubmissionData, string>({
      query: (id) => `/results/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Submission', id }],
      
      // Keep individual submissions cached for 30 minutes
      keepUnusedDataFor: 1800,
      
      // Automatic polling for pending submissions
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getCacheEntry }
      ) {
        try {
          // Wait for the initial query to resolve
          await cacheDataLoaded;
          
          let pollCount = 0;
          const MAX_POLLS = 240; // Max 20 minutes of polling (240 * 5s = 1200s)
          
          // CRITICAL: Start polling interval for ALL submissions, not just pending ones
          // This ensures polling continues even when status changes from not_requested to pending
          const interval = setInterval(async () => {
            try {
              // Stop polling after max attempts to prevent infinite rate limiting
              if (pollCount >= MAX_POLLS) {
                console.log('[RTK Query] Max poll count reached, stopping polling', { submissionId: arg });
                clearInterval(interval);
                return;
              }
              pollCount++;
              
              // Get current cache state to check for pending components
              const currentCache = getCacheEntry();
              if (!currentCache?.data) return;
              
              const componentStatus = (currentCache.data?.components as { componentStatus?: Record<string, string> })?.componentStatus;
              const hasPendingComponents = componentStatus && Object.values(componentStatus).some(
                status => status === 'pending'
              );
              
              // Skip fetch if no pending components (optimization)
              if (!hasPendingComponents && currentCache.data?.status !== 'pending') {
                return;
              }
              
              console.log('[RTK Query Polling]', {
                submissionId: arg,
                hasPendingComponents,
                componentStatus,
                pollCount,
                timestamp: new Date().toISOString()
              });
              
              const response = await fetch(`/api/results/${arg}`);
              if (response.ok) {
                const updatedData = await response.json();
                
                console.log('[RTK Query Polling] Response received', {
                  submissionId: arg,
                  oldComponentStatus: (currentCache.data?.components as { componentStatus?: Record<string, string> })?.componentStatus,
                  newComponentStatus: (updatedData?.components as { componentStatus?: Record<string, string> })?.componentStatus,
                  hasComponentData: !!updatedData?.components,
                  componentKeys: updatedData?.components ? Object.keys(updatedData.components) : [],
                  timestamp: new Date().toISOString()
                });
                
                // CRITICAL: Mutate the draft using Immer to trigger React re-renders
                // RTK Query uses Immer, so we MUST mutate the draft, not return new objects
                updateCachedData((draft) => {
                  // Replace ALL top-level properties to ensure React detects changes
                  Object.assign(draft, updatedData);
                });
              } else if (response.status === 429) {
                // Rate limited - stop polling temporarily
                console.warn('[RTK Query] Rate limited, pausing polling for 30s', { submissionId: arg });
                clearInterval(interval);
                setTimeout(() => {
                  // Restart polling after 30 seconds if still pending
                  const latestCache = getCacheEntry();
                  const latestStatus = (latestCache?.data?.components as { componentStatus?: Record<string, string> })?.componentStatus;
                  const stillPending = latestStatus && Object.values(latestStatus).some(s => s === 'pending');
                  if (stillPending) {
                    console.log('[RTK Query] Resuming polling after rate limit pause', { submissionId: arg });
                    // Restart polling with a longer interval for production
                    const resumeInterval = setInterval(async () => {
                      try {
                        const resumeResponse = await fetch(`/api/results/${arg}`);
                        if (resumeResponse.ok) {
                          const resumeData = await resumeResponse.json();
                          updateCachedData((draft) => {
                            Object.assign(draft, resumeData);
                          });
                          
                          // Stop polling if no more pending components
                          const resumeStatus = (resumeData?.components as { componentStatus?: Record<string, string> })?.componentStatus;
                          const hasResumePending = resumeStatus && Object.values(resumeStatus).some(s => s === 'pending');
                          if (!hasResumePending && resumeData?.status !== 'pending') {
                            clearInterval(resumeInterval);
                          }
                        }
                      } catch (error) {
                        console.error('[RTK Query] Resume polling error:', error);
                      }
                    }, 15000); // 15 second interval in production
                  }
                }, 30000);
              }
            } catch (error) {
              console.error('[RTK Query] Polling error:', error);
            }
          }, 
          process.env.NODE_ENV === 'production' ? 15000 : 5000 // 15s in prod, 5s in dev
          ); // Polling interval adjusted for production vs localhost
          
          // Clean up the interval when the cache entry is removed
          await cacheEntryRemoved;
          clearInterval(interval);
        } catch {
          // If cacheEntryRemoved resolves before cacheDataLoaded, do nothing
        }
      },
    }),

    // Retry a failed submission
    retrySubmission: builder.mutation<RetrySubmissionResponse, RetrySubmissionRequest>({
      query: (body) => ({
        url: '/submissions/retry',
        method: 'POST',
        body,
      }),
      // Invalidate the submission cache to trigger a refetch
      invalidatesTags: (_result, _error, { submissionId }) => [
        { type: 'Submission', id: submissionId },
        { type: 'SubmissionsList', id: 'LIST' },
      ],
    }),

    // Check for stale submissions
    checkStaleSubmissions: builder.mutation<void, void>({
      query: () => ({
        url: '/submissions/check-stale',
        method: 'GET',
      }),
      invalidatesTags: [{ type: 'SubmissionsList', id: 'LIST' }],
    }),

    // Create submission with optimistic update for instant UI feedback
    createSubmission: builder.mutation<FormSubmissionData, {
      targetMarket: string;
      product: string;
      generateLandingPage?: boolean;
      eventName?: string;
      eventDates?: string;
      eventLocation?: string;
      uniqueSellingPoints?: string;
      ticketTiers?: string;
      speakers?: string;
      keyTransformations?: string;
      testimonials?: string;
      leadCaptureStrategy?: string;
    }>({
      query: (body) => ({
        url: '/audience-architect',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'SubmissionsList', id: 'LIST' }],
    }),

    // Submit contact form with optimistic feedback
    submitContactForm: builder.mutation<{ success: boolean; message: string }, {
      name: string;
      email: string;
      company?: string;
      phone?: string;
      plan?: string;
      message?: string;
      budget?: string;
      timeline?: string;
    }>({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body: {
          formType: 'pricing_contact',
          ...body,
          timestamp: new Date().toISOString(),
        },
      }),
      // No cache invalidation needed - this is a one-time submission
    }),

    // Generate landing page with optimistic status update
    generateLandingPage: builder.mutation<{ id: string; message: string }, {
      submissionId: string;
      eventName: string;
      eventDates: string;
      eventLocation: string;
      uniqueSellingPoints: string;
      ticketTiers: string;
      speakers?: string;
      keyTransformations?: string;
      testimonials?: string;
      leadCaptureStrategy?: string;
      generateLandingPage?: boolean;
    }>({
      query: (body) => ({
        url: '/generate-landing-page',
        method: 'POST',
        body,
      }),
      // Optimistically update submission status before API responds
      async onQueryStarted({ submissionId }, { dispatch, queryFulfilled }) {
        // Optimistically update the cached submission
        const patchResult = dispatch(
          submissionsApi.util.updateQueryData('getSubmissionById', submissionId, (draft) => {
            if (draft.components) {
              const status = draft.components as { componentStatus?: Record<string, string> };
              if (!status.componentStatus) {
                (draft.components as { componentStatus?: Record<string, string> }).componentStatus = {};
              }
              const componentStatus = (draft.components as { componentStatus: Record<string, string> }).componentStatus;
              componentStatus.eventFunnel = 'pending';
              componentStatus.landingPage = 'pending';
            }
          })
        );

        try {
          await queryFulfilled;
          // CRITICAL: Force refetch after mutation completes to restart polling
          // This ensures polling restarts for the newly pending components
          dispatch(
            submissionsApi.util.invalidateTags([{ type: 'Submission', id: submissionId }])
          );
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      // Force cache invalidation to trigger refetch and restart polling
      invalidatesTags: (_result, _error, { submissionId }) => [
        { type: 'Submission', id: submissionId },
      ],
    }),
    // Generate offer prompt (direct, stateless)
    generateOfferPrompt: builder.mutation<{
      id: string;
      status: 'completed' | 'failed';
      payload?: Record<string, unknown>;
      message?: string;
    }, {
      programName: string;
      targetAudience: string;
      corePromise: string;
      programStructure: string;
      investmentDetails: string;
      idealCandidateCriteria: string;
      quickStartBonus: string;
    }>({
      query: (body) => ({
        url: '/offer-prompt',
        method: 'POST',
        body,
      }),
    }),
    // Update submission content (output or components)
    updateSubmissionContent: builder.mutation<FormSubmissionData, {
      id: string;
      output?: string;
      components?: Record<string, unknown>;
      title?: string;
    }>({
      query: ({ id, ...body }) => ({
        url: `/results/${id}`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted({ id, output, components, title }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          submissionsApi.util.updateQueryData('getSubmissionById', id, (draft) => {
            if (typeof title === 'string') draft.title = title;
            if (typeof output === 'string') draft.output = output;
            if (components && typeof components === 'object') {
              draft.components = { ...(draft.components || {}), ...components };
            }
            draft.updatedAt = new Date();
          })
        );
        try {
          // CRITICAL: Wait for the mutation to complete successfully
          const { data } = await queryFulfilled;
          
          // Replace optimistic update with actual server response in RTK Query cache
          // Use Immer mutation pattern for proper cache updates
          dispatch(
            submissionsApi.util.updateQueryData('getSubmissionById', id, (draft) => {
              Object.assign(draft, data);
            })
          );
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
          console.error('[updateSubmissionContent] Failed to save:', error);
        }
      },
      // Force cache invalidation to ensure fresh data on next load
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Submission', id },
        { type: 'SubmissionsList', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetSubmissionsQuery,
  useGetSubmissionByIdQuery,
  useRetrySubmissionMutation,
  useCheckStaleSubmissionsMutation,
  useCreateSubmissionMutation,
  useSubmitContactFormMutation,
  useGenerateLandingPageMutation,
  useGenerateOfferPromptMutation,
  useUpdateSubmissionContentMutation,
  usePrefetch,
} = submissionsApi;
