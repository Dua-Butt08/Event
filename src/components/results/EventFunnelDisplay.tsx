"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Card, CardContent } from '@/components/ui/card';
import { OriginalInputDisplay } from '@/components/shared/OriginalInputDisplay';
import { InlineEditableContent } from '@/components/shared/InlineEditableContent';

interface EventFunnelDisplayProps {
  data: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  onUpdate?: (updatedData: Record<string, unknown>) => Promise<void>;
  isUpdating?: boolean;
}

export function EventFunnelDisplay({ data, inputs, onUpdate, isUpdating = false }: EventFunnelDisplayProps) {
  if (!onUpdate) {
    return <EventFunnelReadOnly data={data} inputs={inputs} />;
  }

  return (
    <InlineEditableContent data={data} onUpdate={onUpdate} isUpdating={isUpdating}>
      {({ localData, EditableText, undo, redo, canUndo, canRedo }) => (
        <EventFunnelEditable 
          data={localData}
          inputs={inputs}
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

function EventFunnelEditable({
  data,
  inputs,
  EditableText,
  undo: _undo,
  redo: _redo,
  canUndo: _canUndo,
  canRedo: _canRedo
}: {
  data: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  EditableText: React.ComponentType<any>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  // Extract the actual funnel data from nested structure
  const content = (data.content || data) as any;
  const funnelData = content.funnel || content;
  
  // Extract sections
  const hero = funnelData.hero || {};
  const overview = funnelData.overview || {};
  const targetAudience = funnelData.target_audience || {};
  const schedule = funnelData.schedule || {};
  const speakers = funnelData.speakers || {};
  const ticketing = funnelData.ticketing || {};
  const socialProof = funnelData.social_proof || {};
  const faq = funnelData.faq || {};
  const ctaStrategy = funnelData.cta_strategy || content.cta_strategy || {};
  const metadata = funnelData.metadata || content.metadata || {};

  // Generate formatted text for copy
  const generateFormattedText = () => {
    let text = '=== HIGH-CONVERTING EVENT FUNNEL ===\n\n';
    
    if (hero.headline) {
      text += `HERO SECTION\n${hero.headline}\n`;
      if (hero.subheadline) text += `${hero.subheadline}\n`;
      text += '\n';
    }
    
    if (overview.event_name) {
      text += `EVENT: ${overview.event_name}\n`;
      if (overview.dates) text += `DATES: ${overview.dates}\n`;
      if (overview.location) text += `LOCATION: ${overview.location}\n`;
      text += '\n';
    }
    
    return text;
  };

  const formattedText = generateFormattedText();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg shadow-blue-500/50">
          <span className="text-4xl">🌊</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
          High-Converting Event Funnel
        </h1>
        <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto">
          Your complete event marketing funnel blueprint
        </p>
      </div>

      {/* Original Input Section - Reusable Component */}
      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <CopyButton text={formattedText} label="Copy" />
        <DownloadButton content={formattedText} filename="event-funnel-blueprint" label="Open in Google Docs" theme={{ primary: '#f97316', secondary: '#fb7185', title: 'Event Funnel Blueprint' }} />
      </div>

      {/* Hero Section */}
      {hero.headline && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-blue-500/30 backdrop-blur-sm shadow-xl shadow-blue-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-400 mb-2">Hero Section</h2>
                <p className="text-sm text-[var(--muted)]">Your powerful first impression</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* 5 W's Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hero.what && (
                  <div className="group p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      What
                    </h4>
                    <p className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={hero.what} 
                        fieldPath="content.funnel.hero.what" 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </p>
                  </div>
                )}
                {hero.who && (
                  <div className="group p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      Who
                    </h4>
                    <p className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={hero.who} 
                        fieldPath="content.funnel.hero.who" 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </p>
                  </div>
                )}
                {hero.when && (
                  <div className="group p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-400/40 transition-all duration-300">
                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      When
                    </h4>
                    <p className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={hero.when} 
                        fieldPath="content.funnel.hero.when" 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </p>
                  </div>
                )}
                {hero.where && (
                  <div className="group p-5 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                    <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      Where
                    </h4>
                    <p className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={hero.where} 
                        fieldPath="content.funnel.hero.where" 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </p>
                  </div>
                )}
                {hero.why && (
                  <div className="group p-5 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300">
                    <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                      Why
                    </h4>
                    <p className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={hero.why} 
                        fieldPath="content.funnel.hero.why" 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </p>
                  </div>
                )}
              </div>

              {/* Headline + Subheadline + CTAs - Combined */}
              {hero.headline && (() => {
                let heroContentText = `## Main Headline\n\n${hero.headline}\n\n`;

                if (hero.subheadline) {
                  heroContentText += `### Subheadline\n\n${hero.subheadline}\n\n`;
                }

                if (hero.ctas && Array.isArray(hero.ctas) && hero.ctas.length > 0) {
                  heroContentText += `### Call to Actions\n\n`;
                  hero.ctas.forEach((cta: any) => {
                    const ctaText = typeof cta === 'string' ? cta : (cta.label || cta.text || 'CTA');
                    heroContentText += `- ${ctaText}\n`;
                  });
                }

                return (
                  <div className="space-y-6">
                    <EditableText
                      value={heroContentText}
                      fieldPath="content.funnel.hero"
                      className="text-[var(--text)]"
                      multiline
                      renderMarkdown
                    />
                  </div>
                );
              })()}

              {/* Visual */}
              {hero.visual && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                  <h4 className="text-sm font-bold text-pink-400 uppercase mb-3">Visual Recommendation</h4>
                  <p className="text-[var(--text)] text-sm italic leading-relaxed">
                    <EditableText 
                      value={hero.visual} 
                      fieldPath="content.funnel.hero.visual" 
                      className="text-[var(--text)] italic"
                      multiline
                    />
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Section */}
      {overview.event_name && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-cyan-500/30 backdrop-blur-sm shadow-xl shadow-cyan-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Event Overview</h2>
                <p className="text-sm text-[var(--muted)]">Essential event details</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {overview.event_name && (
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2">Event Name</h4>
                  <p className="text-lg font-semibold text-[var(--text)]">
                    <EditableText 
                      value={overview.event_name} 
                      fieldPath="content.funnel.overview.event_name" 
                      className="text-lg font-semibold text-[var(--text)]"
                    />
                  </p>
                </div>
              )}
              {overview.dates && (
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2">Dates</h4>
                  <p className="text-lg text-[var(--text)]">
                    <EditableText 
                      value={overview.dates} 
                      fieldPath="content.funnel.overview.dates" 
                      className="text-lg text-[var(--text)]"
                    />
                  </p>
                </div>
              )}
              {overview.location && (
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2">Location</h4>
                  <p className="text-lg text-[var(--text)]">
                    <EditableText 
                      value={overview.location} 
                      fieldPath="content.funnel.overview.location" 
                      className="text-lg text-[var(--text)]"
                    />
                  </p>
                </div>
              )}
              {overview.value_proposition && (
                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2">Value Proposition</h4>
                  <p className="text-base text-[var(--text)] leading-relaxed">
                    <EditableText 
                      value={overview.value_proposition} 
                      fieldPath="content.funnel.overview.value_proposition" 
                      className="text-[var(--text)]"
                      multiline
                    />
                  </p>
                </div>
              )}
            </div>
            
            {overview.key_outcomes && Array.isArray(overview.key_outcomes) && (
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-400 uppercase mb-4">Key Outcomes</h4>
                <ul className="grid md:grid-cols-2 gap-3">
                  {overview.key_outcomes.map((outcome: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1 flex-shrink-0">✓</span>
                      <span className="text-[var(--text)] text-sm leading-relaxed">
                        <EditableText 
                          value={outcome} 
                          fieldPath={`content.funnel.overview.key_outcomes[${idx}]`} 
                          className="text-[var(--text)]"
                          multiline
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Target Audience Section */}
      {targetAudience.description && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-purple-500/30 backdrop-blur-sm shadow-xl shadow-purple-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-purple-400 mb-2">Target Audience</h2>
                <p className="text-sm text-[var(--muted)]">Who this event is perfect for</p>
              </div>
            </div>
            
            {targetAudience.description && (
              <p className="text-base text-[var(--text)] leading-relaxed mb-6">
                <EditableText 
                  value={targetAudience.description} 
                  fieldPath="content.funnel.target_audience.description" 
                  className="text-[var(--text)]"
                  multiline
                />
              </p>
            )}
            
            {targetAudience.fit_check && Array.isArray(targetAudience.fit_check) && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-purple-400 uppercase mb-4">This Event is For You If:</h4>
                {targetAudience.fit_check.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
                    <span className="text-purple-400 mt-0.5">→</span>
                    <span className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={item} 
                        fieldPath={`content.funnel.target_audience.fit_check[${idx}]`} 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Schedule Section */}
      {schedule.days && Array.isArray(schedule.days) && schedule.days.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-green-500/30 backdrop-blur-sm shadow-xl shadow-green-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-400 mb-2">Event Schedule</h2>
                <p className="text-sm text-[var(--muted)]">Daily agenda and sessions</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {schedule.days.map((day: any, idx: number) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
                  <h3 className="text-xl font-bold text-green-400 mb-4">
                    <EditableText 
                      value={day.day || `Day ${idx + 1}`} 
                      fieldPath={`content.funnel.schedule.days[${idx}].day`} 
                      className="text-xl font-bold text-green-400"
                    />
                  </h3>
                  {day.date && <p className="text-sm text-[var(--muted)] mb-4">
                    <EditableText 
                      value={day.date} 
                      fieldPath={`content.funnel.schedule.days[${idx}].date`} 
                      className="text-sm text-[var(--muted)]"
                    />
                  </p>}
                  
                  {day.sessions && Array.isArray(day.sessions) && (
                    <div className="space-y-4">
                      {day.sessions.map((session: any, sIdx: number) => (
                        <div key={sIdx} className="pl-4 border-l-2 border-green-500/30">
                          {session.time && <p className="text-xs font-bold text-green-400 mb-1">
                            <EditableText 
                              value={session.time} 
                              fieldPath={`content.funnel.schedule.days[${idx}].sessions[${sIdx}].time`} 
                              className="text-xs font-bold text-green-400"
                            />
                          </p>}
                          <p className="text-base font-semibold text-[var(--text)] mb-1">
                            <EditableText 
                              value={session.title || session.name} 
                              fieldPath={`content.funnel.schedule.days[${idx}].sessions[${sIdx}].${session.title ? 'title' : 'name'}`} 
                              className="text-base font-semibold text-[var(--text)]"
                            />
                          </p>
                          {session.description && <p className="text-sm text-[var(--muted)] leading-relaxed">
                            <EditableText 
                              value={session.description} 
                              fieldPath={`content.funnel.schedule.days[${idx}].sessions[${sIdx}].description`} 
                              className="text-sm text-[var(--muted)]"
                              multiline
                            />
                          </p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Speakers Section */}
      {speakers.items && Array.isArray(speakers.items) && speakers.items.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-orange-500/30 backdrop-blur-sm shadow-xl shadow-orange-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎤</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-orange-400 mb-2">Featured Speakers</h2>
                <p className="text-sm text-[var(--muted)]">Industry experts and thought leaders</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {speakers.items.map((speaker: any, idx: number) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                  <h3 className="text-xl font-bold text-orange-400 mb-2">
                    <EditableText 
                      value={speaker.name} 
                      fieldPath={`content.funnel.speakers.items[${idx}].name`} 
                      className="text-xl font-bold text-orange-400"
                    />
                  </h3>
                  {speaker.title && <p className="text-sm text-[var(--muted)] mb-3">
                    <EditableText 
                      value={speaker.title} 
                      fieldPath={`content.funnel.speakers.items[${idx}].title`} 
                      className="text-sm text-[var(--muted)]"
                    />
                  </p>}
                  {speaker.bio && <p className="text-sm text-[var(--text)] leading-relaxed mb-3">
                    <EditableText 
                      value={speaker.bio} 
                      fieldPath={`content.funnel.speakers.items[${idx}].bio`} 
                      className="text-sm text-[var(--text)]"
                      multiline
                    />
                  </p>}
                  {speaker.session_focus && (
                    <div className="mt-3 pt-3 border-t border-orange-500/20">
                      <p className="text-xs font-bold text-orange-400 uppercase mb-1">Session Focus</p>
                      <p className="text-sm text-[var(--text)]">
                        <EditableText 
                          value={speaker.session_focus} 
                          fieldPath={`content.funnel.speakers.items[${idx}].session_focus`} 
                          className="text-sm text-[var(--text)]"
                          multiline
                        />
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticketing Section */}
      {ticketing.pricing_table && Array.isArray(ticketing.pricing_table) && ticketing.pricing_table.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-yellow-500/30 backdrop-blur-sm shadow-xl shadow-yellow-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎟️</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Ticket Options</h2>
                <p className="text-sm text-[var(--muted)]">Choose the package that fits your needs</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {ticketing.pricing_table.map((tier: any, idx: number) => {
                // Combine all ticket info into markdown
                let ticketText = '';

                if (tier.badge) {
                  ticketText += `**${tier.badge}**\n\n`;
                }

                ticketText += `## ${tier.name}\n\n`;

                // Handle price
                if (tier.price) {
                  if (typeof tier.price === 'object' && tier.price !== null && 'early_bird_amount' in tier.price && tier.price.early_bird_amount) {
                    ticketText += `**Price:** $${tier.price.early_bird_amount}`;
                    if ('amount' in tier.price && tier.price.amount) {
                      ticketText += ` ~~$${tier.price.amount}~~`;
                    }
                    ticketText += '\n\n';
                  } else if (typeof tier.price === 'string') {
                    ticketText += `**Price:** ${tier.price}\n\n`;
                  } else if (typeof tier.price === 'object' && tier.price !== null && 'amount' in tier.price) {
                    ticketText += `**Price:** $${tier.price.amount}\n\n`;
                  } else if (typeof tier.price === 'number') {
                    ticketText += `**Price:** $${tier.price}\n\n`;
                  }
                }

                // Features/Benefits
                if (tier.features || tier.benefits) {
                  ticketText += '### Included:\n\n';
                  (tier.features || tier.benefits).forEach((feature: string) => {
                    ticketText += `- ${feature}\n`;
                  });
                  ticketText += '\n';
                }

                // CTA
                if (tier.cta) {
                  const ctaLabel = typeof tier.cta === 'object' ? tier.cta.label : tier.cta;
                  ticketText += `**CTA:** ${ctaLabel}\n\n`;
                  if (typeof tier.cta === 'object' && tier.cta.note) {
                    ticketText += `*${tier.cta.note}*\n`;
                  }
                }

                return (
                  <div
                    key={idx}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      tier.badge
                        ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                        : 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50'
                    }`}
                  >
                    <EditableText
                      value={ticketText}
                      fieldPath={`content.funnel.ticketing.pricing_table[${idx}]`}
                      className="text-[var(--text)]"
                      multiline
                      renderMarkdown
                    />
                  </div>
                );
              })}
            </div>
            
            {(ticketing.scarcity_note || ticketing.payment_plan_note) && (
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {ticketing.scarcity_note && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-sm text-red-400 font-semibold">
                      ⚡ <EditableText 
                        value={ticketing.scarcity_note} 
                        fieldPath="content.funnel.ticketing.scarcity_note" 
                        className="text-sm text-red-400 font-semibold"
                        multiline
                      />
                    </p>
                  </div>
                )}
                {ticketing.payment_plan_note && (
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-sm text-blue-400">
                      💳 <EditableText 
                        value={ticketing.payment_plan_note} 
                        fieldPath="content.funnel.ticketing.payment_plan_note" 
                        className="text-sm text-blue-400"
                        multiline
                      />
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Social Proof Section */}
      {socialProof.items && Array.isArray(socialProof.items) && socialProof.items.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-cyan-500/30 backdrop-blur-sm shadow-xl shadow-cyan-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">What Attendees Say</h2>
                <p className="text-sm text-[var(--muted)]">Real testimonials from past events</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {socialProof.items.map((testimonial: any, idx: number) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
                  {testimonial.quote && (
                    <p className="text-lg italic text-cyan-300 mb-4 leading-relaxed">
                      &ldquo;<EditableText 
                        value={testimonial.quote} 
                        fieldPath={`content.funnel.social_proof.items[${idx}].quote`} 
                        className="text-lg italic text-cyan-300"
                        multiline
                      />&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">
                        <EditableText 
                          value={testimonial.author} 
                          fieldPath={`content.funnel.social_proof.items[${idx}].author`} 
                          className="text-sm font-semibold text-[var(--text)]"
                        />
                      </p>
                      {testimonial.role && testimonial.company && (
                        <p className="text-xs text-[var(--muted)]">
                          <EditableText 
                            value={testimonial.role} 
                            fieldPath={`content.funnel.social_proof.items[${idx}].role`} 
                            className="text-xs text-[var(--muted)]"
                          />, <EditableText 
                            value={testimonial.company} 
                            fieldPath={`content.funnel.social_proof.items[${idx}].company`} 
                            className="text-xs text-[var(--muted)]"
                          />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section */}
      {faq.items && Array.isArray(faq.items) && faq.items.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-indigo-500/30 backdrop-blur-sm shadow-xl shadow-indigo-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">❓</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-indigo-400 mb-2">Frequently Asked Questions</h2>
                <p className="text-sm text-[var(--muted)]">Everything you need to know</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {faq.items.map((item: any, idx: number) => {
                const faqText = `### ${item.question}\n\n${item.answer}`;

                return (
                  <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
                    <EditableText
                      value={faqText}
                      fieldPath={`content.funnel.faq.items[${idx}]`}
                      className="text-[var(--text)]"
                      multiline
                      renderMarkdown
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Strategy */}
      {ctaStrategy.buttons && Array.isArray(ctaStrategy.buttons) && ctaStrategy.buttons.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-green-500/30 backdrop-blur-sm shadow-xl shadow-green-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-400 mb-2">CTA Strategy</h2>
                <p className="text-sm text-[var(--muted)]">Strategic call-to-action placement</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {ctaStrategy.buttons.map((button: any, idx: number) => (
                <div key={idx} className={`p-5 rounded-xl border ${
                  button.style === 'primary' 
                    ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30' 
                    : 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-[var(--text)] mb-1">
                        <EditableText 
                          value={button.label} 
                          fieldPath={`cta_strategy.buttons[${idx}].label`} 
                          className="text-lg font-semibold text-[var(--text)]"
                        />
                      </p>
                      {button.note && <p className="text-sm text-[var(--muted)]">
                        <EditableText 
                          value={button.note} 
                          fieldPath={`cta_strategy.buttons[${idx}].note`} 
                          className="text-sm text-[var(--muted)]"
                          multiline
                        />
                      </p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      button.style === 'primary' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      <EditableText 
                        value={button.style || 'secondary'} 
                        fieldPath={`cta_strategy.buttons[${idx}].style`} 
                        className="text-xs font-bold"
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {metadata.missing_or_inferred && Array.isArray(metadata.missing_or_inferred) && metadata.missing_or_inferred.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-600/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <details className="group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--muted)] group-open:text-[var(--text)] transition-colors">
                    📊 View Generation Notes
                  </span>
                  <span className="text-xs text-[var(--muted)] ml-auto">Click to expand</span>
                </div>
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <ul className="space-y-2">
                  {metadata.missing_or_inferred.map((note: string, idx: number) => (
                    <li key={idx} className="text-xs text-[var(--muted)] leading-relaxed">
                      • <EditableText 
                        value={note} 
                        fieldPath={`metadata.missing_or_inferred[${idx}]`} 
                        className="text-xs text-[var(--muted)]"
                        multiline
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Read-only version without inline editing
function EventFunnelReadOnly({ data, inputs }: { data: Record<string, unknown>; inputs?: Record<string, unknown> }) {
  // Extract the actual funnel data from nested structure
  const content = (data.content || data) as any;
  const funnelData = content.funnel || content;
  
  // Extract sections
  const hero = funnelData.hero || {};
  const overview = funnelData.overview || {};
  const metadata = funnelData.metadata || content.metadata || {};

  // Generate formatted text for copy
  const generateFormattedText = () => {
    let text = '=== HIGH-CONVERTING EVENT FUNNEL ===\n\n';
    if (hero.headline) {
      text += `HERO SECTION\n${hero.headline}\n`;
      if (hero.subheadline) text += `${hero.subheadline}\n`;
      text += '\n';
    }
    if (overview.event_name) {
      text += `EVENT: ${overview.event_name}\n`;
      if (overview.dates) text += `DATES: ${overview.dates}\n`;
      if (overview.location) text += `LOCATION: ${overview.location}\n`;
      text += '\n';
    }
    return text;
  };

  const formattedText = generateFormattedText();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg shadow-blue-500/50">
          <span className="text-4xl">🌊</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
          High-Converting Event Funnel
        </h1>
        <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto">
          Your complete event marketing funnel blueprint
        </p>
      </div>

      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      <div className="flex justify-center gap-4 flex-wrap">
        <CopyButton text={formattedText} label="Copy" />
        <DownloadButton content={formattedText} filename="event-funnel-blueprint" label="Open in Google Docs" theme={{ primary: '#f97316', secondary: '#fb7185', title: 'Event Funnel Blueprint' }} />
      </div>

      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-blue-500/30 backdrop-blur-sm shadow-xl shadow-blue-500/10">
        <CardContent className="pt-8">
          <p className="text-[var(--text)] text-center">
            ⚠️ Inline editing is not available in read-only mode. Full content is displayed for viewing and copying.
          </p>
        </CardContent>
      </Card>

      {metadata.missing_or_inferred && Array.isArray(metadata.missing_or_inferred) && metadata.missing_or_inferred.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-600/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <details className="group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--muted)] group-open:text-[var(--text)] transition-colors">
                    📊 View Generation Notes
                  </span>
                  <span className="text-xs text-[var(--muted)] ml-auto">Click to expand</span>
                </div>
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <ul className="space-y-2">
                  {metadata.missing_or_inferred.map((note: string, idx: number) => (
                    <li key={idx} className="text-xs text-[var(--muted)] leading-relaxed">• {note}</li>
                  ))}
                </ul>
              </div>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
