"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetSubmissionsQuery, usePrefetch } from "@/store/api/submissionsApi";

export function HistoryTable() {
  const router = useRouter();
  const prefetchSubmission = usePrefetch('getSubmissionById');
  const [limit] = useState<number>(10);
  const [_offset] = useState<number>(0);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortOrder] = useState<'newest' | 'oldest'>('newest');

  // RTK Query - automatic caching, deduplication, and loading states
  const { data, isLoading, error, isFetching } = useGetSubmissionsQuery({
    limit,
    offset: _offset,
  });

  const items = useMemo(() => {
    const submissions = data?.submissions || [];
    // Filter out offer prompts (they have their own dedicated page)
    const filteredSubmissions = submissions.filter(s => s.kind !== 'offer');
    // Sort based on sortOrder
    return [...filteredSubmissions].sort((a, b) => {
      const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt as Date;
      const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt as Date;
      return sortOrder === 'newest' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
  }, [data?.submissions, sortOrder]);

  const handleViewResults = (submissionId: string, kind: string) => {
    // Prefetch submission data for instant navigation
    prefetchSubmission(submissionId, { force: true });
    
    // Navigate to appropriate page based on submission kind
    if (kind === 'offer') {
      router.push(`/offer-prompt?id=${submissionId}`);
    } else {
      router.push(`/results/${submissionId}`);
    }
  };

  return (
    <Card className="bg-[var(--card)]/40 backdrop-blur-xl border-[var(--border)]/30">
      <CardContent className="pt-6">
        {/* Table */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-red-500 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="font-medium">
                {error instanceof Error ? error.message : "Failed to load history"}
              </div>
            </div>
            <p className="text-[var(--muted)] text-sm max-w-md">
              Unable to fetch your submission history. Please try again.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center gap-3 text-[var(--muted)]">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--accent)]"></div>
            <span>Loading history…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-[var(--muted)]">No submissions found.</div>
          </div>
        ) : (
          <>
            {/* Background update indicator - always rendered to prevent layout shifts */}
            <div className={`flex items-center justify-center mb-4 transition-opacity duration-300 ${isFetching ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-bounce"></div>
              </div>
            </div>
            <div className="space-y-2">
              {items.map((s) => {
                const created =
                  typeof s.createdAt === "string"
                    ? new Date(s.createdAt)
                    : (s.createdAt as Date);
                const isExpanded = expandedRow === s.id;
                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-lg transition-all duration-300 border ${
                      isExpanded 
                        ? 'bg-[var(--card)]/40 border-[var(--accent)]/50 shadow-lg shadow-[var(--accent)]/10 -m-1 scale-[1.02]' 
                        : 'bg-[var(--bg-elev)]/50 hover:bg-[var(--bg-elev)] border-[var(--border)]/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[var(--bg-elev)] flex items-center justify-center text-sm">
                          📄
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-[var(--text)] truncate">
                            {s.title || "Untitled submission"}
                          </div>
                          <div className="text-xs text-[var(--muted)]">
                            {created.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            s.status === "completed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : s.status === "pending"
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {s.status}
                        </span>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] h-8 text-xs"
                          onClick={() => handleViewResults(s.id, s.kind)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`h-8 text-xs ${
                            isExpanded
                              ? 'bg-[var(--accent)]/20 border-[var(--accent)]/50 text-[var(--accent)]'
                              : 'border-[var(--border)]/50'
                          }`}
                          onClick={() =>
                            setExpandedRow((prev) => (prev === s.id ? null : s.id))
                          }
                        >
                          {isExpanded ? "Hide" : "Inputs"}
                        </Button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700/30 bg-[var(--card)]/20 rounded-lg p-3 -mx-3">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-sm">
                            📋
                          </div>
                          <h4 className="font-semibold text-[var(--text)] text-sm">Input Details</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(() => {
                            const inputFields = [
                              { key: 'product', label: 'Product', icon: '📦' },
                              { key: 'targetMarket', label: 'Target Market', icon: '🎯' },
                              { key: 'eventName', label: 'Event Name', icon: '🎪' },
                              { key: 'eventDates', label: 'Event Dates', icon: '📅' },
                              { key: 'eventLocation', label: 'Event Location', icon: '📍' },
                              { key: 'ticketTiers', label: 'Ticket Tiers', icon: '🎟️' },
                              { key: 'speakers', label: 'Speakers', icon: '🎤' },
                              { key: 'uniqueSellingPoints', label: 'USPs', icon: '💎' },
                              { key: 'keyTransformations', label: 'Transformations', icon: '✨' },
                              { key: 'testimonials', label: 'Testimonials', icon: '💬' },
                              { key: 'leadCaptureStrategy', label: 'Lead Strategy', icon: '🔗' },
                              { key: 'generateLandingPage', label: 'Landing Page', icon: '🚀' },
                            ];

                            // Filter to only show fields that exist in this submission and exclude timestamp
                            const availableInputs = Object.entries(s.inputs || {}).filter(
                              ([key]) => key !== 'timestamp'
                            );
                          
                            return availableInputs.map(([key, value]) => {
                              // Find matching field config or create a generic one
                              const fieldConfig = inputFields.find(f => f.key === key) || {
                                key,
                                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                                icon: '📄'
                              };
                            
                              // Skip empty values
                              if (!value || value === '') return null;
                            
                              return (
                                <div
                                  key={key}
                                  className="p-2 rounded-md bg-[var(--bg-elev)]/80 border border-[var(--border)]/30 shadow-sm"
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="text-sm">{fieldConfig.icon}</span>
                                    <div className="min-w-0">
                                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide truncate">
                                        {fieldConfig.label}
                                      </h4>
                                      <p className="text-xs text-[var(--text)] mt-1 line-clamp-2 break-words">
                                        {typeof value === "string" ? value : typeof value === "boolean" ? (value ? "Yes" : "No") : JSON.stringify(value)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}