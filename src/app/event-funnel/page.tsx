"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui-kit/Textarea';
import { Input } from '@/components/ui-kit/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AppLayout } from '@/components/layout/AppLayout';
import { BrodysBrain } from '@/components/ui/BrodysBrain';
import { useGenerateLandingPageMutation } from '@/store/api/submissionsApi';

export default function EventFunnelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const submissionId = searchParams.get('submissionId') || '';
  
  const [eventName, setEventName] = useState('');
  const [eventDates, setEventDates] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState('');
  const [ticketTiers, setTicketTiers] = useState('');
  const [speakers, setSpeakers] = useState('');
  const [keyTransformations, setKeyTransformations] = useState('');
  const [testimonials, setTestimonials] = useState('');
  const [leadCaptureStrategy, setLeadCaptureStrategy] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [generateLandingPageMutation, { isLoading }] = useGenerateLandingPageMutation();

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!submissionId) {
      setError('Submission ID is required. Please create an Audience Architect strategy first.');
      return;
    }

    try {
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
        generateLandingPage: true, // Generate both Event Funnel and Landing Page
      }).unwrap();

      // Navigate to results page
      router.push(`/results/${submissionId}`);
    } catch (err) {
      console.error('Event funnel generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate event funnel. Please try again.');
    }
  };

  const content = (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FuturisticBackground scrollY={0} />
      
      <div className="relative pt-12 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="mb-3 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 text-[var(--accent)] border border-[var(--accent)]/30 px-4 py-1.5 text-sm rounded-full inline-block backdrop-blur-sm">
              🌊 Event Funnel & Landing Page
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.2' }}>
              Generate Your Event Funnel & Landing Page
            </h1>
            <p className="text-sm text-[var(--muted)] max-w-2xl mx-auto">
              Provide your event details to create a comprehensive funnel and landing page strategy.
            </p>
          </div>

          <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-[var(--text)]">Event Details</CardTitle>
              <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg p-3 mt-3">
                <p className="text-xs text-[var(--text)] font-medium mb-1">📋 Required Information</p>
                <p className="text-xs text-[var(--muted)]">
                  Fields marked with <span className="text-red-500">*</span> are required
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <label htmlFor="eventName" className="text-sm font-medium text-[var(--text)] block mb-2">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value)}
                    placeholder="e.g., Productivity Masterclass 2024"
                    required
                    className="w-full h-9 text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="eventDates" className="text-sm font-medium text-[var(--text)] block mb-2">
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
                    className="w-full h-9 text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="eventLocation" className="text-sm font-medium text-[var(--text)] block mb-2">
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
                    className="w-full h-9 text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="uniqueSellingPoints" className="text-sm font-medium text-[var(--text)] block mb-2">
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
                    className="min-h-[100px] text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="ticketTiers" className="text-sm font-medium text-[var(--text)] block mb-2">
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
                    className="min-h-[100px] text-sm"
                  />
                </div>

                <div className="border-t border-[var(--border)]/30 pt-4">
                  <p className="text-sm font-medium text-[var(--text)] mb-4">Optional Details</p>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label htmlFor="speakers" className="text-sm font-medium text-[var(--text)] block mb-2">
                        Notable Speakers <span className="text-xs text-[var(--muted)]">(optional)</span>
                      </label>
                      <p className="text-xs text-[var(--muted)]">
                        List key speakers and their credentials
                      </p>
                      <Textarea
                        id="speakers"
                        value={speakers}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpeakers(e.target.value)}
                        placeholder="e.g., &#10;• John Doe - CEO of TechCorp, Forbes 30 Under 30&#10;• Jane Smith - Bestselling author of 'Scale Smart'"
                        className="min-h-[80px] text-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="keyTransformations" className="text-sm font-medium text-[var(--text)] block mb-2">
                        Key Event Transformations <span className="text-xs text-[var(--muted)]">(optional)</span>
                      </label>
                      <p className="text-xs text-[var(--muted)]">
                        What transformations will attendees experience?
                      </p>
                      <Textarea
                        id="keyTransformations"
                        value={keyTransformations}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeyTransformations(e.target.value)}
                        placeholder="e.g., Go from overwhelmed solopreneur to confident business leader with a clear growth strategy"
                        className="min-h-[80px] text-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="testimonials" className="text-sm font-medium text-[var(--text)] block mb-2">
                        Social Proof / Testimonials <span className="text-xs text-[var(--muted)]">(optional)</span>
                      </label>
                      <p className="text-xs text-[var(--muted)]">
                        Share testimonials or social proof from past events
                      </p>
                      <Textarea
                        id="testimonials"
                        value={testimonials}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTestimonials(e.target.value)}
                        placeholder='"This event changed my business! I implemented the strategies and doubled my revenue in 6 months." - Sarah Johnson, Founder of XYZ Co.'
                        className="min-h-[80px] text-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="leadCaptureStrategy" className="text-sm font-medium text-[var(--text)] block mb-2">
                        Lead Capture Strategy <span className="text-xs text-[var(--muted)]">(optional)</span>
                      </label>
                      <p className="text-xs text-[var(--muted)]">
                        How do you want to capture leads?
                      </p>
                      <Textarea
                        id="leadCaptureStrategy"
                        value={leadCaptureStrategy}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLeadCaptureStrategy(e.target.value)}
                        placeholder="e.g., Registration form with email, phone, and company name. Offer free downloadable workbook for early registrants."
                        className="min-h-[80px] text-sm"
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
                  className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] hover:from-[var(--accent)]/90 hover:to-[var(--accent-2)]/90 h-10 text-base"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner className="mr-2" size="sm" />
                      Generating Funnel & Landing Page...
                    </>
                  ) : (
                    'Generate Funnel & Landing Page'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-xs text-[var(--muted)]">
              💡 Your event funnel and landing page strategy will be ready in about 2 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      {content}
      <BrodysBrain />
    </AppLayout>
  );
}
