"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { InlineEditableContent } from '@/components/shared/InlineEditableContent';

interface OfferPromptDisplayProps {
  data: any; // Accept raw payload.content structure from webhook
  onUpdate?: (updatedData: Record<string, unknown>) => Promise<void>;
  isUpdating?: boolean;
}

export function OfferPromptDisplay({ data, onUpdate, isUpdating = false }: OfferPromptDisplayProps) {
  // For now, just show a simple message if no update function
  // In the future, we can add a full read-only version
  if (!onUpdate) {
    return (
      <div className="space-y-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 mb-6 shadow-2xl shadow-pink-500/50">
            <span className="text-5xl">💡</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4 leading-tight">
            Offer Prompt
          </h1>
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-pink-500/30 backdrop-blur-sm shadow-xl shadow-pink-500/10">
            <CardContent className="pt-8">
              <p className="text-[var(--text)] text-center">
                ⚠️ Inline editing is not available in read-only mode.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <InlineEditableContent data={data} onUpdate={onUpdate} isUpdating={isUpdating}>
      {({ localData, EditableText, undo, redo, canUndo, canRedo }) => (
        <OfferPromptEditable 
          data={localData} 
          EditableText={EditableText}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      )}
    </InlineEditableContent>
  );
}

function OfferPromptEditable({
  data,
  EditableText,
  undo: _undo,
  redo: _redo,
  canUndo: _canUndo,
  canRedo: _canRedo
}: {
  data: any;
  EditableText: React.ComponentType<any>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const title = data.title as string | undefined;
  const programName = data.program_name as string | undefined;
  const targetAudience = data.target_audience as string | undefined;
  const scarcity = data.scarcity as { spots_left?: number; line?: string } | undefined;
  const outcome = data.outcome as {
    month?: string;
    core_promise?: string;
    program_structure?: string;
    copy_block?: string;
  } | undefined;
  const programModel = data.program_model as {
    initial_phase?: {
      title?: string;
      quick_wins?: string;
      deliverables?: string[];
      duration?: string;
    };
    subsequent_phases?: Array<{
      title?: string;
      focus?: string;
      deliverables?: string[];
      duration?: string;
    }>;
    proprietary_tools?: string[];
    ongoing_support?: string;
  } | undefined;
  const investment = data.investment as {
    details?: string;
    price?: { amount?: number; currency?: string };
    setup_fee?: { amount?: number; currency?: string };
    payment_structure?: string;
    trial_or_free_period?: string;
  } | undefined;
  const idealCandidate = data.ideal_candidate as {
    preface?: string;
    criteria?: string[];
    humorous_criterion?: string;
  } | undefined;
  const gettingStarted = data.getting_started as { steps?: string[] } | undefined;
  const signOff = data.sign_off as string | undefined;
  const ps = data.ps as {
    quick_start_bonus?: string;
    description?: string;
    value?: { amount?: number; currency?: string };
  } | undefined;
  const meta = data.meta as { language?: string; version?: string } | undefined;


  const fullDocumentText = (() => {
    let doc = '=== OFFER PROMPT DOCUMENT ===\n\n';
    if (title) {
      doc += `1. Title\n${title}\n`;
      if (targetAudience) doc += `Audience: ${targetAudience}\n`;
      doc += '\n';
    }
    if (scarcity?.line) {
      doc += `2. Scarcity\n${scarcity.line}`;
      if (typeof scarcity.spots_left === 'number') doc += ` (Spots left: ${scarcity.spots_left})`;
      doc += '\n\n';
    }
    doc += '3. Outcome Description\n';
    doc += `Here's what I'm doing with the ${programName || 'program'}${outcome?.month ? ` in ${outcome.month}` : ''}:\n`;
    if (outcome?.core_promise) doc += `The outcome is simple: ${outcome.core_promise}\n`;
    if (outcome?.program_structure) doc += `We'll do it with ${outcome.program_structure}.\n`;
    if (outcome?.copy_block) doc += `\n${outcome.copy_block}\n`;
    doc += '\n';

    doc += '4. Program Model\n';
    if (programModel?.initial_phase) {
      const ip = programModel.initial_phase;
      doc += `Initial Phase: ${ip.title || 'Quick Wins'}\n`;
      if (ip.quick_wins) doc += `Quick Wins: ${ip.quick_wins}\n`;
      if (ip.deliverables?.length) {
        doc += 'Deliverables:\n';
        ip.deliverables.forEach((d) => (doc += `- ${d}\n`));
      }
      if (ip.duration) doc += `Duration: ${ip.duration}\n`;
      doc += '\n';
    }
    if (programModel?.subsequent_phases?.length) {
      doc += 'Subsequent Phases:\n';
      programModel.subsequent_phases.forEach((phase, idx) => {
        doc += `Phase ${idx + 1}: ${phase.title || ''}\n`;
        if (phase.focus) doc += `Focus: ${phase.focus}\n`;
        if (phase.deliverables?.length) {
          doc += 'Deliverables:\n';
          phase.deliverables.forEach((d) => (doc += `- ${d}\n`));
        }
        if (phase.duration) doc += `Duration: ${phase.duration}\n`;
        doc += '\n';
      });
    }
    if (programModel?.proprietary_tools?.length) {
      doc += 'Proprietary Tools:\n';
      programModel.proprietary_tools.forEach((t) => (doc += `- ${t}\n`));
      doc += '\n';
    }
    if (programModel?.ongoing_support) {
      doc += `Ongoing Support: ${programModel.ongoing_support}\n\n`;
    }

    if (investment) {
      doc += '5. Investment\n';
      if (investment.details) doc += `${investment.details}\n`;
      if (investment.price?.amount) doc += `Price: ${investment.price.amount} ${investment.price.currency || 'USD'}\n`;
      if (investment.setup_fee?.amount !== undefined) doc += `Setup Fee: ${investment.setup_fee.amount} ${investment.setup_fee.currency || 'USD'}\n`;
      if (investment.payment_structure) doc += `Payment Structure: ${investment.payment_structure}\n`;
      if (investment.trial_or_free_period) doc += `${investment.trial_or_free_period}\n`;
      doc += '\n';
    }

    if (idealCandidate) {
      doc += '6. Ideal Candidate\n';
      if (idealCandidate.preface) doc += `${idealCandidate.preface}\n`;
      if (idealCandidate.criteria?.length) {
        idealCandidate.criteria.forEach((c) => (doc += `- ${c}\n`));
      }
      if (idealCandidate.humorous_criterion) doc += `${idealCandidate.humorous_criterion}\n`;
      doc += '\n';
    }

    if (gettingStarted?.steps?.length) {
      doc += '7. Getting Started\n';
      gettingStarted.steps.forEach((s, idx) => (doc += `Step ${idx + 1}: ${s}\n`));
      doc += '\n';
    }

    if (signOff) {
      doc += '8. Sign-off\n';
      doc += `${signOff}\n\n`;
    }

    if (ps) {
      doc += '9. P.S.\n';
      if (ps.quick_start_bonus) doc += `Quick-Start Bonus: ${ps.quick_start_bonus}\n`;
      if (ps.description) doc += `${ps.description}\n`;
      if (ps.value?.amount) doc += `Bonus value: ${ps.value.amount} ${ps.value.currency || 'USD'}\n`;
      doc += '\n';
    }

    if (meta) {
      doc += `Meta: Language=${meta.language || 'en-US'}${meta.version ? `, Version=${meta.version}` : ''}\n`;
    }

    return doc;
  })();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 mb-6 shadow-2xl shadow-pink-500/50 hover:scale-105 transition-transform duration-300">
          <span className="text-5xl">💡</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-4 leading-tight">
          Offer Prompt
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
          A compelling program invitation crafted for conversions
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="transform hover:scale-105 transition-transform duration-200">
          <CopyButton text={fullDocumentText} label="Copy" />
        </div>
        <div className="transform hover:scale-105 transition-transform duration-200">
          <DownloadButton content={fullDocumentText} filename="offer-prompt-full" label="Open in Google Docs" theme={{ primary: '#ec4899', secondary: '#8b5cf6', title: 'Offer Prompt' }} />
        </div>
        {/* Generate New Offer Prompt Button */}
        <Button 
          onClick={() => window.location.href = '/offer-prompt'}
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Generate New Offer Prompt
        </Button>
      </div>

      {/* 1. Title */}
      {title && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-pink-500/30 backdrop-blur-sm shadow-xl shadow-pink-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-pink-400 mb-2">Title</h2>
                <p className="text-sm text-[var(--muted)]">Compelling headline with program name and key outcome</p>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-[var(--text)] leading-tight">
              <EditableText value={title} fieldPath="title" className="text-[var(--text)]" />
            </p>
            {targetAudience && (
              <p className="text-sm text-[var(--muted)] mt-3">Audience: <EditableText value={targetAudience} fieldPath="target_audience" className="text-[var(--text)]" /></p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 2. Scarcity */}
      {scarcity?.line && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-red-500/30 backdrop-blur-sm shadow-xl shadow-red-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-400 mb-2">Scarcity</h2>
                <p className="text-sm text-[var(--muted)]">Limited spots available</p>
              </div>
            </div>
            <p className="text-lg text-red-300 font-semibold">
              <EditableText value={scarcity.line} fieldPath="scarcity.line" className="text-[var(--text)]" />
            </p>
            {typeof scarcity.spots_left === 'number' && (
              <p className="text-sm text-[var(--muted)] mt-2">Spots left: {scarcity.spots_left}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 3. Outcome Description */}
      {(programName || outcome) && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-green-500/30 backdrop-blur-sm shadow-xl shadow-green-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-400 mb-2">Outcome Description</h2>
                <p className="text-sm text-[var(--muted)]">Clear promise and structure</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-base text-[var(--text)] leading-relaxed">
                Here's what I'm doing with the <span className="font-semibold"><EditableText value={programName || 'program'} fieldPath="program_name" className="text-[var(--text)]" /></span>
                {outcome?.month ? <> in <span className="font-semibold"><EditableText value={outcome.month} fieldPath="outcome.month" className="text-[var(--text)]" /></span></> : null}:
              </p>
              {outcome?.core_promise && (
                <p className="text-base text-[var(--text)] leading-relaxed">
                  The outcome is simple: <span className="font-semibold"><EditableText value={outcome.core_promise} fieldPath="outcome.core_promise" className="text-[var(--text)]" multiline /></span>
                </p>
              )}
              {outcome?.program_structure && (
                <p className="text-base text-[var(--text)] leading-relaxed">
                  We'll do it with <span className="font-semibold"><EditableText value={outcome.program_structure} fieldPath="outcome.program_structure" className="text-[var(--text)]" multiline /></span>.
                </p>
              )}
              {outcome?.copy_block && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <EditableText value={outcome.copy_block} fieldPath="outcome.copy_block" className="text-sm text-[var(--text)] leading-relaxed" multiline />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Program Model */}
      {programModel && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-blue-500/30 backdrop-blur-sm shadow-xl shadow-blue-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🧭</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-400 mb-2">Program Model</h2>
                <p className="text-sm text-[var(--muted)]">Phases, tools, and support</p>
              </div>
            </div>
            <div className="space-y-6">
              {programModel.initial_phase && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30">
                  <h3 className="text-xl font-bold text-blue-300 mb-2">
                    <EditableText value={programModel.initial_phase.title || 'Initial Phase'} fieldPath="program_model.initial_phase.title" className="text-[var(--text)]" /> — Quick Wins
                  </h3>
                  {programModel.initial_phase.quick_wins && (
                    <EditableText value={programModel.initial_phase.quick_wins} fieldPath="program_model.initial_phase.quick_wins" className="text-sm text-[var(--text)] leading-relaxed mb-3" multiline />
                  )}
                  {programModel.initial_phase.deliverables && programModel.initial_phase.deliverables.length > 0 && (
                    <ul className="space-y-2">
                      {programModel.initial_phase.deliverables.map((item, idx) => (
                        <li key={idx} className="text-sm text-[var(--text)]">• <EditableText value={item} fieldPath={`program_model.initial_phase.deliverables[${idx}]`} className="text-[var(--text)]" multiline /></li>
                      ))}
                    </ul>
                  )}
                  {programModel.initial_phase.duration && (
                    <p className="text-xs text-[var(--muted)] mt-3">Duration: <EditableText value={programModel.initial_phase.duration} fieldPath="program_model.initial_phase.duration" className="text-[var(--text)]" /></p>
                  )}
                </div>
              )}

              {programModel.subsequent_phases && programModel.subsequent_phases.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-blue-300">Subsequent Phases</h3>
                  {programModel.subsequent_phases.map((phase, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20">
                      <p className="text-lg font-semibold text-[var(--text)] mb-1">
                        <EditableText value={phase.title || ''} fieldPath={`program_model.subsequent_phases[${idx}].title`} className="text-[var(--text)]" />
                      </p>
                      {phase.focus && (
                        <EditableText value={phase.focus} fieldPath={`program_model.subsequent_phases[${idx}].focus`} className="text-sm text-[var(--muted)] mb-2" multiline />
                      )}
                      {phase.deliverables && phase.deliverables.length > 0 && (
                        <ul className="space-y-2">
                          {phase.deliverables.map((d, j) => (
                            <li key={j} className="text-sm text-[var(--text)]">- <EditableText value={d} fieldPath={`program_model.subsequent_phases[${idx}].deliverables[${j}]`} className="text-[var(--text)]" multiline /></li>
                          ))}
                        </ul>
                      )}
                      {phase.duration && (
                        <p className="text-xs text-[var(--muted)] mt-2">Duration: <EditableText value={phase.duration} fieldPath={`program_model.subsequent_phases[${idx}].duration`} className="text-[var(--text)]" /></p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {programModel.proprietary_tools && programModel.proprietary_tools.length > 0 && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                  <h3 className="text-base font-semibold text-purple-300 mb-2">Proprietary Tools</h3>
                  <ul className="space-y-2">
                    {programModel.proprietary_tools.map((tool, idx) => (
                      <li key={idx} className="text-sm text-[var(--text)]">• <EditableText value={tool} fieldPath={`program_model.proprietary_tools[${idx}]`} className="text-[var(--text)]" /></li>
                    ))}
                  </ul>
                </div>
              )}

              {programModel.ongoing_support && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                  <h3 className="text-base font-semibold text-green-300 mb-2">Ongoing Support</h3>
                  <EditableText value={programModel.ongoing_support} fieldPath="program_model.ongoing_support" className="text-sm text-[var(--text)] leading-relaxed" multiline />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5. Investment */}
      {investment && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-yellow-500/30 backdrop-blur-sm shadow-xl shadow-yellow-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">💳</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Investment</h2>
                <p className="text-sm text-[var(--muted)]">Pricing and payment options</p>
              </div>
            </div>
            {investment.details && (
              <EditableText value={investment.details} fieldPath="investment.details" className="text-base text-[var(--text)] leading-relaxed mb-4" multiline />
            )}
            <div className="grid md:grid-cols-3 gap-4">
              {investment.price?.amount && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                  <p className="text-xs font-semibold text-yellow-400 uppercase mb-1">Price</p>
                  <p className="text-lg font-bold text-[var(--text)]">{investment.price.amount} {investment.price.currency || 'USD'}</p>
                </div>
              )}
              {investment.setup_fee && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
                  <p className="text-xs font-semibold text-orange-400 uppercase mb-1">Setup Fee</p>
                  <p className="text-lg font-bold text-[var(--text)]">{investment.setup_fee.amount} {investment.setup_fee.currency || 'USD'}</p>
                </div>
              )}
              {investment.payment_structure && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                  <p className="text-xs font-semibold text-green-400 uppercase mb-1">Payment Structure</p>
                  <p className="text-lg font-bold text-[var(--text)]">{investment.payment_structure}</p>
                </div>
              )}
            </div>
            {investment.trial_or_free_period && (
              <p className="text-sm text-[var(--muted)] mt-3">{investment.trial_or_free_period}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 6. Ideal Candidate */}
      {idealCandidate && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-purple-500/30 backdrop-blur-sm shadow-xl shadow-purple-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">👤</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-purple-400 mb-2">Ideal Candidate</h2>
                <p className="text-sm text-[var(--muted)]">Who this is perfect for</p>
              </div>
            </div>
            {idealCandidate.preface && (
              <EditableText value={idealCandidate.preface} fieldPath="ideal_candidate.preface" className="text-base text-[var(--text)] leading-relaxed mb-4" multiline />
            )}
            {idealCandidate.criteria && idealCandidate.criteria.length > 0 && (
              <ul className="space-y-2">
                {idealCandidate.criteria.map((c, idx) => (
                  <li key={idx} className="text-sm text-[var(--text)]">• <EditableText value={c} fieldPath={`ideal_candidate.criteria[${idx}]`} className="text-[var(--text)]" /></li>
                ))}
              </ul>
            )}
            {idealCandidate.humorous_criterion && (
              <EditableText value={idealCandidate.humorous_criterion} fieldPath="ideal_candidate.humorous_criterion" className="text-sm text-[var(--muted)] mt-3 italic" multiline />
            )}
          </CardContent>
        </Card>
      )}

      {/* 7. Getting Started */}
      {gettingStarted?.steps && gettingStarted.steps.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-cyan-500/30 backdrop-blur-sm shadow-xl shadow-cyan-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Getting Started</h2>
                <p className="text-sm text-[var(--muted)]">How to join</p>
              </div>
            </div>
            <ol className="space-y-3 ml-4">
              {gettingStarted.steps.map((step, idx) => (
                <li key={idx} className="text-base text-[var(--text)] leading-relaxed">
                  <span className="text-cyan-300 font-semibold mr-2">Step {idx + 1}:</span> <EditableText value={step} fieldPath={`getting_started.steps[${idx}]`} className="text-[var(--text)]" multiline />
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* 8. Sign-off */}
      {signOff && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-500/30 backdrop-blur-sm shadow-xl shadow-slate-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
                <span className="text-2xl">✍️</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-300 mb-2">Sign-off</h2>
                <p className="text-sm text-[var(--muted)]">Program creator</p>
              </div>
            </div>
            <EditableText value={signOff} fieldPath="sign_off" className="text-base text-[var(--text)] leading-relaxed whitespace-pre-line" multiline />
          </CardContent>
        </Card>
      )}

      {/* 9. P.S. Section */}
      {ps && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-emerald-500/30 backdrop-blur-sm shadow-xl shadow-emerald-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">📎</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-emerald-400 mb-2">P.S.</h2>
                <p className="text-sm text-[var(--muted)]">Quick-start bonus</p>
              </div>
            </div>
            {ps.quick_start_bonus && (
              <p className="text-base text-[var(--text)] leading-relaxed mb-3">
                As soon as you decide, we'll get you access to <span className="font-semibold"><EditableText value={ps.quick_start_bonus} fieldPath="ps.quick_start_bonus" className="text-[var(--text)]" /></span>.
              </p>
            )}
            {ps.description && (
              <EditableText value={ps.description} fieldPath="ps.description" className="text-sm text-[var(--muted)] leading-relaxed" multiline />
            )}
            {ps.value?.amount && (
              <p className="text-sm text-[var(--muted)] mt-2">Bonus value: {ps.value.amount} {ps.value.currency || 'USD'}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
