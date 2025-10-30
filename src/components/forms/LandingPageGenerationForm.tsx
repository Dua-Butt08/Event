"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui-kit/Input';
import { Textarea } from '@/components/ui-kit/Textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useGenerateLandingPageMutation } from '@/store/api/submissionsApi';

interface LandingPageFormProps {
  submissionId: string;
  onSuccess?: () => void;
}

export function LandingPageGenerationForm({ submissionId, onSuccess }: LandingPageFormProps) {
  const [eventName, setEventName] = useState('');
  const [eventDates, setEventDates] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState('');
  const [ticketTiers, setTicketTiers] = useState('');
  const [speakers, setSpeakers] = useState('');
  const [keyTransformations, setKeyTransformations] = useState('');
  const [testimonials, setTestimonials] = useState('');
  const [leadCaptureStrategy, setLeadCaptureStrategy] = useState('');
  
  const [success, setSuccess] = useState(false);
  
  // RTK Query mutation for landing page generation
  const [generateLandingPage, { isLoading, error: mutationError }] = useGenerateLandingPageMutation();
  
  const error = mutationError 
    ? (typeof mutationError === 'object' && 'data' in mutationError 
        ? (mutationError.data as { error?: string })?.error 
        : 'Failed to generate landing page')
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await generateLandingPage({
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
        generateLandingPage: true,
      }).unwrap();

      setSuccess(true);
      
      // Call onSuccess callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error('Landing page generation error:', err);
      // Error is handled by RTK Query and displayed via mutationError
    }
  };

  if (success) {
    return (
      <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50 shadow-xl">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-[var(--text)] mb-2">Landing Page Generation Started!</h3>
            <p className="text-[var(--muted)]">
              Your landing page is being generated. This page will refresh automatically to show the results.
            </p>
            <LoadingSpinner className="mx-auto mt-6" size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[var(--text)]">
          🎯 Generate Event Landing Page
        </CardTitle>
        <CardDescription className="text-[var(--muted)]">
          Complete the following information to generate a customized landing page for your event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg p-4 mb-4">
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] hover:from-[var(--accent)]/90 hover:to-[var(--accent-2)]/90 py-6 text-lg"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2" size="sm" />
                Generating Landing Page...
              </>
            ) : (
              'Generate Landing Page'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
