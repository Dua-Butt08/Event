"use client";

/**
 * @deprecated This modal component is deprecated in favor of the standalone page at /offer-prompt
 * Use router.push('/offer-prompt') instead of rendering this modal.
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
import { ProcessingLoader } from '@/components/ui/ProcessingLoader';
import { useGenerateOfferPromptMutation, submissionsApi } from '@/store/api/submissionsApi';
import { useDispatch } from 'react-redux';
import { setOfferPromptResult } from '@/store/slices/offerPromptSlice';
import { useRouter } from 'next/navigation';

interface OfferPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OfferPromptModal({ isOpen, onClose }: OfferPromptModalProps) {
  const [generateOfferPrompt, { isLoading }] = useGenerateOfferPromptMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const [programName, setProgramName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [corePromise, setCorePromise] = useState('');
  const [programStructure, setProgramStructure] = useState('');
  const [investmentDetails, setInvestmentDetails] = useState('');
  const [idealCandidateCriteria, setIdealCandidateCriteria] = useState('');
  const [quickStartBonus, setQuickStartBonus] = useState('');

  const [error, setError] = useState<string | null>(null);

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

      onClose();
      router.push('/results/offer');
    } catch (err) {
      console.error('Offer prompt generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate offer prompt. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent 
        className="w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-4xl !bg-gradient-to-br !from-slate-900 !to-slate-800 text-white !border-2 !border-orange-500/50 shadow-2xl shadow-orange-500/20" 
        style={{ minHeight: '400px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/60 backdrop-blur-sm">
            <div className="w-full max-w-xl">
              <ProcessingLoader 
                stage="generating" 
                customTitle="Crafting Your Offer Prompt"
                customIcon="💡"
                customMessages={[
                  "Analyzing your program structure",
                  "Crafting compelling copy",
                  "Optimizing for conversions",
                  "Adding persuasive elements",
                  "Finalizing your offer prompt"
                ]}
              />
            </div>
          </div>
        )}
        <DialogHeader className="border-b border-orange-500/20 pb-4 mb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg">
              💡
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold !text-white">
                Generate Offer Prompt
              </DialogTitle>
              <DialogDescription className="!text-gray-400 text-sm mt-1">
                Create a compelling offer with AI assistance
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-1 -mx-1">
          <div className="space-y-5 py-4">
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <div>
                <p className="text-sm text-white font-semibold">Required Information</p>
                <p className="text-xs text-gray-400">All fields must be completed to generate your offer</p>
              </div>
            </div>
          </div>

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
              Basic Information
            </h3>
            <div className="space-y-2">
              <label htmlFor="programName" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="text-orange-400">●</span> Program Name
              </label>
              <Input 
                id="programName" 
                value={programName} 
                onChange={(e) => setProgramName(e.target.value)} 
                required 
                placeholder="e.g., Elite Marketing Masterclass"
                className="!bg-slate-800/50 !border-slate-700 hover:!border-orange-500/50 focus:!border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="targetAudience" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="text-orange-400">●</span> Target Audience
              </label>
              <Input 
                id="targetAudience" 
                value={targetAudience} 
                onChange={(e) => setTargetAudience(e.target.value)} 
                required 
                placeholder="e.g., Marketing consultants earning $100K+"
                className="!bg-slate-800/50 !border-slate-700 hover:!border-orange-500/50 focus:!border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Section 2: Offer Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
              Offer Details
            </h3>
            <div className="space-y-2">
              <label htmlFor="corePromise" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="text-orange-400">●</span> Core Promise
              </label>
              <Textarea 
                id="corePromise" 
                value={corePromise} 
                onChange={(e) => setCorePromise(e.target.value)} 
                required 
                className="min-h-[90px] !bg-slate-800/50 !border-slate-700 hover:!border-orange-500/50 focus:!border-orange-500 transition-colors resize-none" 
                placeholder="What transformation or outcome do you promise?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="programStructure" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="text-orange-400">●</span> Program Structure
              </label>
              <Textarea 
                id="programStructure" 
                value={programStructure} 
                onChange={(e) => setProgramStructure(e.target.value)} 
                required 
                className="min-h-[90px] !bg-slate-800/50 !border-slate-700 hover:!border-orange-500/50 focus:!border-orange-500 transition-colors resize-none" 
                placeholder="Describe the program format, duration, and delivery method"
              />
            </div>
          </div>

          {/* Section 3: Qualifications & Bonuses */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
              Investment & Criteria
            </h3>
            <div className="space-y-2">
              <label htmlFor="investmentDetails" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="text-orange-400">●</span> Investment Details
              </label>
              <Textarea 
                id="investmentDetails" 
                value={investmentDetails} 
                onChange={(e) => setInvestmentDetails(e.target.value)} 
                required 
                className="min-h-[90px] !bg-slate-800/50 !border-slate-700 hover:!border-orange-500/50 focus:!border-orange-500 transition-colors resize-none" 
                placeholder="Pricing, payment options, and any guarantees"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="idealCandidateCriteria" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="text-orange-400">●</span> Ideal Candidate Criteria
              </label>
              <Textarea 
                id="idealCandidateCriteria" 
                value={idealCandidateCriteria} 
                onChange={(e) => setIdealCandidateCriteria(e.target.value)} 
                required 
                className="min-h-[90px] !bg-slate-800/50 !border-slate-700 hover:!border-orange-500/50 focus:!border-orange-500 transition-colors resize-none" 
                placeholder="Who is the perfect fit for this program?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="quickStartBonus" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="text-orange-400">●</span> Quick-Start Bonus
              </label>
              <Textarea 
                id="quickStartBonus" 
                value={quickStartBonus} 
                onChange={(e) => setQuickStartBonus(e.target.value)} 
                required 
                className="min-h-[90px] !bg-slate-800/50 !border-slate-700 hover:!border-orange-500/50 focus:!border-orange-500 transition-colors resize-none" 
                placeholder="Special bonuses or incentives for early action"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="border-t border-orange-500/20 pt-4 mt-4 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isLoading} 
              className="flex-1 !border-slate-700 !text-gray-300 hover:!bg-slate-800 hover:!border-slate-600 transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 !text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
