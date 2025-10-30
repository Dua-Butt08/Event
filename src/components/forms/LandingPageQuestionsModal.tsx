"use client";

/**
 * @deprecated This modal component is deprecated in favor of the standalone page at /event-funnel
 * Use router.push(`/event-funnel?submissionId=${submissionId}`) instead of rendering this modal.
 * This file is kept for backward compatibility only.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui-kit/Input';
import { Textarea } from '@/components/ui-kit/Textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useGenerateLandingPageMutation } from '@/store/api/submissionsApi';

interface LandingPageQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  onSuccess?: () => void;
  /** Whether to generate landing page alongside event funnel (default: true) */
  generateLandingPage?: boolean;
  /** Pre-filled event data from original submission (if available) */
  initialEventData?: {
    eventName?: string;
    eventDates?: string;
    eventLocation?: string;
    uniqueSellingPoints?: string;
    ticketTiers?: string;
    speakers?: string;
    keyTransformations?: string;
    testimonials?: string;
    leadCaptureStrategy?: string;
  };
}

export function LandingPageQuestionsModal({
  isOpen,
  onClose,
  submissionId,
  onSuccess,
  generateLandingPage = true,
  initialEventData
}: LandingPageQuestionsModalProps) {
  const [generateLandingPageMutation, { isLoading }] = useGenerateLandingPageMutation();
  const [eventName, setEventName] = useState(initialEventData?.eventName || '');
  const [eventDates, setEventDates] = useState(initialEventData?.eventDates || '');
  const [eventLocation, setEventLocation] = useState(initialEventData?.eventLocation || '');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState(initialEventData?.uniqueSellingPoints || '');
  const [ticketTiers, setTicketTiers] = useState(initialEventData?.ticketTiers || '');
  const [speakers, setSpeakers] = useState(initialEventData?.speakers || '');
  const [keyTransformations, setKeyTransformations] = useState(initialEventData?.keyTransformations || '');
  const [testimonials, setTestimonials] = useState(initialEventData?.testimonials || '');
  const [leadCaptureStrategy, setLeadCaptureStrategy] = useState(initialEventData?.leadCaptureStrategy || '');
  
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // OPTIMISTIC UPDATE: Close modal and trigger success callback immediately
      // This allows parent to show optimistic UI updates right away
      onClose();
      onSuccess?.();

      // API call happens in background - mutation will handle cache updates
      await generateLandingPageMutation({
        submissionId,
        eventName,
        eventDates,
        eventLocation,
        uniqueSellingPoints,
        ticketTiers,
        speakers: speakers || undefined,
        keyTransformations: keyTransformations || undefined,
        testimonials: testimonials || undefined,
        leadCaptureStrategy: leadCaptureStrategy || undefined,
        generateLandingPage,
      }).unwrap();


    } catch (err) {
      console.error('Landing page generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate landing page. Please try again.');
      // Show error but don't revert optimistic update - polling will reflect actual state
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
            🌊 Event Funnel Details {initialEventData ? 'Review' : 'Required'}
          </DialogTitle>
          <DialogDescription className="text-[var(--muted)]">
            {initialEventData ? (
              generateLandingPage 
                ? "Review and confirm your event details below. We'll use these to generate your Event Funnel, then automatically create your Landing Page."
                : "Review and confirm your event details below to generate your Event Funnel strategy."
            ) : (
              generateLandingPage 
                ? "Provide event details to generate your funnel; we'll forward its response to build the landing page automatically."
                : "Provide event details to generate your event funnel strategy."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto px-2">

          
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg p-4">
            <p className="text-sm text-[var(--text)] font-medium mb-1">📋 Required Information</p>
            <p className="text-xs text-[var(--muted)]">
              Fields marked with <span className="text-red-500">*</span> are required
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="eventName" className="text-sm font-medium text-[var(--text)]">
              Event Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value)}
              placeholder="e.g., Productivity Masterclass 2024"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="eventDates" className="text-sm font-medium text-[var(--text)]">
              Event Date(s) & Times <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[var(--muted)]">
              What are the dates and times for your event?
            </p>
            <Input
              id="eventDates"
              value={eventDates}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDates(e.target.value)}
              placeholder="e.g., March 15-17, 2024 | 9:00 AM - 5:00 PM EST"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="eventLocation" className="text-sm font-medium text-[var(--text)]">
              Event Location <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[var(--muted)]">
              Where is the location of your event? (City/country, virtual or in-person)
            </p>
            <Input
              id="eventLocation"
              value={eventLocation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventLocation(e.target.value)}
              placeholder="e.g., New York City, USA (In-person) or Virtual (Zoom)"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="uniqueSellingPoints" className="text-sm font-medium text-[var(--text)]">
              Unique Selling Points <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[var(--muted)]">
              List out 3-5 unique selling points for your event
            </p>
            <Textarea
              id="uniqueSellingPoints"
              value={uniqueSellingPoints}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUniqueSellingPoints(e.target.value)}
              placeholder="e.g., &#10;• Learn proven strategies from industry leaders&#10;• Network with 500+ entrepreneurs&#10;• Get hands-on training with real-world case studies"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ticketTiers" className="text-sm font-medium text-[var(--text)]">
              Ticket Tiers & Pricing <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[var(--muted)]">
              Describe your ticketing options and pricing
            </p>
            <Textarea
              id="ticketTiers"
              value={ticketTiers}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTicketTiers(e.target.value)}
              placeholder="e.g., &#10;Early Bird: $299&#10;Standard: $399&#10;VIP: $599 (includes exclusive networking dinner)"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="border-t border-[var(--border)]/30 pt-4">
            <p className="text-sm font-medium text-[var(--text)] mb-4">Optional Details</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="speakers" className="text-sm font-medium text-[var(--text)]">
                  Notable Speakers
                </label>
                <p className="text-xs text-[var(--muted)]">
                  List key speakers and their credentials
                </p>
                <Textarea
                  id="speakers"
                  value={speakers}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpeakers(e.target.value)}
                  placeholder="e.g., &#10;• John Doe - CEO of TechCorp, Forbes 30 Under 30&#10;• Jane Smith - Bestselling author of 'Scale Smart'"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="keyTransformations" className="text-sm font-medium text-[var(--text)]">
                  Key Event Transformations
                </label>
                <p className="text-xs text-[var(--muted)]">
                  What transformations will attendees experience?
                </p>
                <Textarea
                  id="keyTransformations"
                  value={keyTransformations}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeyTransformations(e.target.value)}
                  placeholder="e.g., Go from overwhelmed solopreneur to confident business leader with a clear growth strategy"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="testimonials" className="text-sm font-medium text-[var(--text)]">
                  Social Proof / Testimonials
                </label>
                <p className="text-xs text-[var(--muted)]">
                  Share testimonials or social proof from past events
                </p>
                <Textarea
                  id="testimonials"
                  value={testimonials}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTestimonials(e.target.value)}
                  placeholder='"This event changed my business! I implemented the strategies and doubled my revenue in 6 months." - Sarah Johnson, Founder of XYZ Co.'
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="leadCaptureStrategy" className="text-sm font-medium text-[var(--text)]">
                  Lead Capture Strategy
                </label>
                <p className="text-xs text-[var(--muted)]">
                  How do you want to capture leads?
                </p>
                <Textarea
                  id="leadCaptureStrategy"
                  value={leadCaptureStrategy}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLeadCaptureStrategy(e.target.value)}
                  placeholder="e.g., Registration form with email, phone, and company name. Offer free downloadable workbook for early registrants."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-[var(--card)] pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${
                'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] hover:from-[var(--accent)]/90 hover:to-[var(--accent-2)]/90'
              }`}
              title=""
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2" size="sm" />
                  Generating...
                </>
              ) : generateLandingPage ? (
                'Generate Funnel + Landing Page'
              ) : (
                'Generate Event Funnel'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
