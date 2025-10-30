"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui-kit/Textarea';
import { Input } from '@/components/ui-kit/Input';
import { Checkbox } from '@/components/ui-kit/Checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AppLayout } from '@/components/layout/AppLayout';
import { BrodysBrain } from '@/components/ui/BrodysBrain';
import { useCreateSubmissionMutation } from '@/store/api/submissionsApi';

export default function AudienceArchitectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [targetMarket, setTargetMarket] = useState('');
  const [product, setProduct] = useState('');
  const [generateLandingPage, setGenerateLandingPage] = useState(false);
  
  // Landing page specific fields
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
  
  // Use RTK Query mutation
  const [createSubmission, { isLoading }] = useCreateSubmissionMutation();
  
  // Check if landing page option should be pre-checked from URL
  const shouldGenerateLandingPage = searchParams.get('generateLandingPage') === 'true';
  
  // Auto-check landing page option if URL parameter is present
  useEffect(() => {
    if (shouldGenerateLandingPage && !generateLandingPage) {
      setGenerateLandingPage(true);
    }
  }, [shouldGenerateLandingPage, generateLandingPage]);

  // Note: beforeunload removed to prevent browser's native dialog
  // The custom warning message in the UI is sufficient

  // Don't render if not authenticated (NextAuth middleware handles redirects)
  // The loading.tsx file handles the initial loading state to prevent layout shift
  if (status === 'loading' || !session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Prepare the submission data
      const submissionData = {
        targetMarket,
        product,
        generateLandingPage,
        ...(generateLandingPage && {
          eventName,
          eventDates,
          eventLocation,
          uniqueSellingPoints,
          ticketTiers,
          speakers,
          keyTransformations,
          testimonials,
          leadCaptureStrategy,
        }),
      };

      // Wait for API call to complete before navigation
      const result = await createSubmission(submissionData).unwrap();
      
      // Navigate to results page with real ID
      router.push(`/results/${result.id}`);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit form. Please try again.');
    }
  };

  const content = (
    <div className="min-h-screen bg-background relative overflow-hidden" suppressHydrationWarning style={{ minHeight: '100vh' }}>
      <FuturisticBackground scrollY={0} />
      
      <div className="relative pt-12 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="mb-3 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 text-[var(--accent)] border border-[var(--accent)]/30 px-4 py-1.5 text-sm rounded-full inline-block backdrop-blur-sm">
              🎯 Audience Architect™
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.2' }}>
              Create Your Complete Marketing Strategy
            </h1>
            <p className="text-sm text-[var(--muted)] max-w-2xl mx-auto">
              Tell us about your target market and product to generate a complete marketing strategy.
            </p>
          </div>

          <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50 shadow-xl" style={{ minHeight: '400px' }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-[var(--text)]">Your Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <label htmlFor="targetMarket" className="text-sm font-medium text-[var(--text)] block mb-2">
                    Target Market
                  </label>
                  <Textarea
                    id="targetMarket"
                    value={targetMarket}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTargetMarket(e.target.value)}
                    placeholder="e.g., Busy entrepreneurs aged 30-45 who struggle with time management"
                    required
                    className="min-h-[70px] text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="product" className="text-sm font-medium text-[var(--text)] block mb-2">
                    Product/Service
                  </label>
                  <Textarea
                    id="product"
                    value={product}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProduct(e.target.value)}
                    placeholder="e.g., A time management app that helps entrepreneurs automate tasks"
                    required
                    className="min-h-[70px] text-sm"
                  />
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--border)]/30">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={generateLandingPage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGenerateLandingPage(e.target.checked)}
                      label="Generate Event Funnel & Landing Page"
                    />
                  </div>

                  {generateLandingPage && (
                    <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1">
                        <label htmlFor="eventName" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Event Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="eventName"
                          value={eventName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value)}
                          placeholder="e.g., Productivity Masterclass 2024"
                          required={generateLandingPage}
                          className="w-full h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="eventDates" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Event Date(s) & Times <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="eventDates"
                          value={eventDates}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDates(e.target.value)}
                          placeholder="e.g., March 15-17, 2024 | 9:00 AM - 5:00 PM EST"
                          required={generateLandingPage}
                          className="w-full h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="eventLocation" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Event Location <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="eventLocation"
                          value={eventLocation}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventLocation(e.target.value)}
                          placeholder="e.g., New York City, USA (In-person) or Virtual (Zoom)"
                          required={generateLandingPage}
                          className="w-full h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="uniqueSellingPoints" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Unique Selling Points <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="uniqueSellingPoints"
                          value={uniqueSellingPoints}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUniqueSellingPoints(e.target.value)}
                          placeholder="e.g., \n• Learn proven strategies from industry leaders\n• Network with 500+ entrepreneurs"
                          required={generateLandingPage}
                          className="min-h-[60px] text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="ticketTiers" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Ticket Tiers & Pricing <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="ticketTiers"
                          value={ticketTiers}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTicketTiers(e.target.value)}
                          placeholder="e.g., \nEarly Bird: $299\nStandard: $399\nVIP: $599"
                          required={generateLandingPage}
                          className="min-h-[60px] text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="speakers" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Notable Speakers <span className="text-xs text-[var(--muted)]">(optional)</span>
                        </label>
                        <Textarea
                          id="speakers"
                          value={speakers}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpeakers(e.target.value)}
                          placeholder="e.g., \n• John Doe - CEO of TechCorp\n• Jane Smith - Author"
                          className="min-h-[50px] text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="keyTransformations" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Key Transformations <span className="text-xs text-[var(--muted)]">(optional)</span>
                        </label>
                        <Textarea
                          id="keyTransformations"
                          value={keyTransformations}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeyTransformations(e.target.value)}
                          placeholder="e.g., Go from overwhelmed solopreneur to confident business leader"
                          className="min-h-[50px] text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="testimonials" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Testimonials <span className="text-xs text-[var(--muted)]">(optional)</span>
                        </label>
                        <Textarea
                          id="testimonials"
                          value={testimonials}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTestimonials(e.target.value)}
                          placeholder='e.g., "This event changed my business!" - Sarah Johnson'
                          className="min-h-[50px] text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="leadCaptureStrategy" className="text-sm font-medium text-[var(--text)] block mb-2">
                          Lead Capture Strategy <span className="text-xs text-[var(--muted)]">(optional)</span>
                        </label>
                        <Textarea
                          id="leadCaptureStrategy"
                          value={leadCaptureStrategy}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLeadCaptureStrategy(e.target.value)}
                          placeholder="e.g., Registration form with email, phone, and company name"
                          className="min-h-[50px] text-sm"
                        />
                      </div>
                    </div>
                  )}
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
                      Submitting...
                    </>
                  ) : (
                    'Generate Marketing Strategy'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-xs text-[var(--muted)]">
              💡 Results will appear as they become ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Wrap with AppLayout
  return (
    <AppLayout>
      {content}
      <BrodysBrain />
    </AppLayout>
  );
}