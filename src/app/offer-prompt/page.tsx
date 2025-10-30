"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui-kit/Textarea';
import { Input } from '@/components/ui-kit/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AppLayout } from '@/components/layout/AppLayout';
import { BrodysBrain } from '@/components/ui/BrodysBrain';
import { useGenerateOfferPromptMutation, submissionsApi } from '@/store/api/submissionsApi';
import { useDispatch } from 'react-redux';
import { setOfferPromptResult } from '@/store/slices/offerPromptSlice';

export default function OfferPromptPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [generateOfferPrompt, { isLoading }] = useGenerateOfferPromptMutation();
  const dispatch = useDispatch();

  const [programName, setProgramName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [corePromise, setCorePromise] = useState('');
  const [programStructure, setProgramStructure] = useState('');
  const [investmentDetails, setInvestmentDetails] = useState('');
  const [idealCandidateCriteria, setIdealCandidateCriteria] = useState('');
  const [quickStartBonus, setQuickStartBonus] = useState('');

  const [error, setError] = useState<string | null>(null);

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

    try {
      const res = await generateOfferPrompt({
        programName,
        targetAudience,
        corePromise,
        programStructure,
        investmentDetails,
        idealCandidateCriteria,
        quickStartBonus,
      }).unwrap();

      dispatch(setOfferPromptResult({
        id: res.id,
        status: res.status,
        payload: res.payload,
        message: res.message,
        timestamp: new Date().toISOString(),
      }));

      // Invalidate submissions list to show new offer prompt in history
      dispatch(submissionsApi.util.invalidateTags([{ type: 'SubmissionsList', id: 'LIST' }]));

      // Persist to local history for refined experience
      try {
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem('offer_prompt_history') : null;
        const list = raw ? JSON.parse(raw) as Array<{ id: string; timestamp: string; payload: Record<string, unknown> }> : [];
        list.unshift({ id: res.id, timestamp: new Date().toISOString(), payload: res.payload as Record<string, unknown> });
        if (typeof window !== 'undefined') window.localStorage.setItem('offer_prompt_history', JSON.stringify(list.slice(0, 50)));
      } catch {
        // ignore persistence errors
      }

      router.push('/results/offer');
    } catch (err) {
      console.error('Offer prompt generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate offer prompt. Please try again.');
    }
  };

  const content = (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FuturisticBackground scrollY={0} />
      
      <div className="relative pt-12 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="mb-3 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 text-[var(--accent)] border border-[var(--accent)]/30 px-4 py-1.5 text-sm rounded-full inline-block backdrop-blur-sm">
              💡 Offer Prompt Generator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.2' }}>
              Generate Your Compelling Offer
            </h1>
            <p className="text-sm text-[var(--muted)] max-w-2xl mx-auto">
              Create a powerful offer with AI assistance to convert more customers.
            </p>
          </div>

          <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-[var(--text)]">Offer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1 h-4 bg-[var(--accent)] rounded-full"></span>
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <label htmlFor="programName" className="text-sm font-medium text-[var(--text)] block mb-2">
                      Program Name <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="programName" 
                      value={programName} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgramName(e.target.value)} 
                      required 
                      placeholder="e.g., Elite Marketing Masterclass"
                      className="w-full h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="targetAudience" className="text-sm font-medium text-[var(--text)] block mb-2">
                      Target Audience <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="targetAudience" 
                      value={targetAudience} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetAudience(e.target.value)} 
                      required 
                      placeholder="e.g., Marketing consultants earning $100K+"
                      className="w-full h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Section 2: Offer Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1 h-4 bg-[var(--accent)] rounded-full"></span>
                    Offer Details
                  </h3>
                  <div className="space-y-3">
                    <label htmlFor="corePromise" className="text-sm font-medium text-[var(--text)] block mb-2">
                      Core Promise <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="corePromise" 
                      value={corePromise} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCorePromise(e.target.value)} 
                      required 
                      className="min-h-[90px] text-sm" 
                      placeholder="What transformation or outcome do you promise?"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="programStructure" className="text-sm font-medium text-[var(--text)] block mb-2">
                      Program Structure <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="programStructure" 
                      value={programStructure} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProgramStructure(e.target.value)} 
                      required 
                      className="min-h-[90px] text-sm" 
                      placeholder="Describe the program format, duration, and delivery method"
                    />
                  </div>
                </div>

                {/* Section 3: Investment & Criteria */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1 h-4 bg-[var(--accent)] rounded-full"></span>
                    Investment & Criteria
                  </h3>
                  <div className="space-y-3">
                    <label htmlFor="investmentDetails" className="text-sm font-medium text-[var(--text)] block mb-2">
                      Investment Details <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="investmentDetails" 
                      value={investmentDetails} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInvestmentDetails(e.target.value)} 
                      required 
                      className="min-h-[90px] text-sm" 
                      placeholder="Pricing, payment options, and any guarantees"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="idealCandidateCriteria" className="text-sm font-medium text-[var(--text)] block mb-2">
                      Ideal Candidate Criteria <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="idealCandidateCriteria" 
                      value={idealCandidateCriteria} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIdealCandidateCriteria(e.target.value)} 
                      required 
                      className="min-h-[90px] text-sm" 
                      placeholder="Who is the perfect fit for this program?"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="quickStartBonus" className="text-sm font-medium text-[var(--text)] block mb-2">
                      Quick-Start Bonus <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      id="quickStartBonus" 
                      value={quickStartBonus} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuickStartBonus(e.target.value)} 
                      required 
                      className="min-h-[90px] text-sm" 
                      placeholder="Special bonuses or incentives for early action"
                    />
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      Generate Offer Prompt
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-xs text-[var(--muted)]">
              💡 Your compelling offer will be ready in about 2 minutes
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
