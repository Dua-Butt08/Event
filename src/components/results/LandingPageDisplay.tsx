"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Card, CardContent } from '@/components/ui/card';
import { OriginalInputDisplay } from '@/components/shared/OriginalInputDisplay';
import { InlineEditableContent } from '@/components/shared/InlineEditableContent';


interface LandingPageDisplayProps {
  data: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  onUpdate?: (updatedData: Record<string, unknown>) => Promise<void>;
  isUpdating?: boolean;
}

export function LandingPageDisplay({ data, inputs, onUpdate, isUpdating = false }: LandingPageDisplayProps) {
  if (!onUpdate) {
    return <LandingPageReadOnly data={data} inputs={inputs} />;
  }

  return (
    <InlineEditableContent data={data} onUpdate={onUpdate} isUpdating={isUpdating}>
      {({ localData, EditableText, undo, redo, canUndo, canRedo }) => (
        <LandingPageEditable 
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

function LandingPageEditable({
  data,
  inputs,
  EditableText,
  undo,
  redo,
  canUndo,
  canRedo
}: {
  data: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  EditableText: React.ComponentType<any>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  // Handle new sections-based structure with editing support
  if (data.sections && Array.isArray(data.sections)) {
    return (
      <LandingPageSectionsDisplayEditable 
        data={data}
        inputs={inputs}
        EditableText={EditableText}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    );
  }
  
  // Extract the actual landing page data from nested structure (legacy format)
  const content = (data.content || data) as any;
  const landingPage = content.landing_page || content;
  
  // Extract sections
  const hero = landingPage.hero || {};
  const overview = landingPage.overview || {};
  const targetAudience = landingPage.target_audience || {};
  const schedule = landingPage.schedule || {};
  const speakers = landingPage.speakers || {};
  const ticketing = landingPage.ticketing || {};
  const testimonials = landingPage.testimonials || {};
  const faq = landingPage.faq || {};
  const ctaStrategy = landingPage.cta_strategy || content.cta_strategy || {};
  const metadata = landingPage.metadata || content.metadata || {};

  // Generate formatted text for copy
  const generateFormattedText = () => {
    let text = '=== EVENT LANDING PAGE ===\n\n';
    
    if (hero.headline) {
      text += `HEADLINE: ${hero.headline}\n`;
      if (hero.subheadline) text += `SUBHEADLINE: ${hero.subheadline}\n`;
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
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-2xl shadow-orange-500/50 hover:scale-105 transition-transform duration-300">
          <span className="text-5xl">🚀</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
          Event Landing Page
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
          Your high-converting landing page blueprint
        </p>
      </div>

      {/* Original Input Section - Reusable Component */}
      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="transform hover:scale-105 transition-transform duration-200">
          <CopyButton text={formattedText} label="Copy" />
        </div>
        <div className="transform hover:scale-105 transition-transform duration-200">
          <DownloadButton content={formattedText} filename="landing-page-blueprint" label="Open in Google Docs" theme={{ primary: '#f59e0b', secondary: '#ef4444', title: 'Landing Page Blueprint' }} />
        </div>
      </div>

      {/* Hero Section */}
      {hero.headline && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-orange-500/30 backdrop-blur-sm shadow-xl shadow-orange-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-orange-400 mb-2">Hero Section</h2>
                <p className="text-sm text-[var(--muted)]">Capture attention immediately</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* 5 W's Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hero.what && (
                  <div className="group p-5 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                    <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      What
                    </h4>
                    <p className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={hero.what} 
                        fieldPath="content.landing_page.hero.what" 
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
                        fieldPath="content.landing_page.hero.who" 
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
                        fieldPath="content.landing_page.hero.when" 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </p>
                  </div>
                )}
                {hero.where && (
                  <div className="group p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      Where
                    </h4>
                    <p className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={hero.where} 
                        fieldPath="content.landing_page.hero.where" 
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
                        fieldPath="content.landing_page.hero.why" 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </p>
                  </div>
                )}
              </div>

              {/* Headline */}
              {hero.headline && (
                <div className="p-6 rounded-xl bg-gradient-to-r from-orange-500/5 to-red-500/5 border border-orange-500/30">
                  <h4 className="text-sm font-bold text-orange-400 uppercase mb-3">Main Headline</h4>
                  <p className="text-2xl md:text-3xl font-bold text-[var(--text)] leading-tight">
                    <EditableText 
                      value={hero.headline} 
                      fieldPath="content.landing_page.hero.headline" 
                      className="text-[var(--text)]"
                      multiline
                    />
                  </p>
                </div>
              )}

              {/* Subheadline */}
              {hero.subheadline && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-red-500/5 to-pink-500/5 border border-red-500/20">
                  <h4 className="text-sm font-bold text-red-400 uppercase mb-3">Subheadline</h4>
                  <p className="text-lg text-[var(--text)] leading-relaxed">
                    <EditableText 
                      value={hero.subheadline} 
                      fieldPath="content.landing_page.hero.subheadline" 
                      className="text-[var(--text)]"
                      multiline
                    />
                  </p>
                </div>
              )}

              {/* CTAs */}
              {hero.ctas && Array.isArray(hero.ctas) && hero.ctas.length > 0 && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
                  <h4 className="text-sm font-bold text-green-400 uppercase mb-4">Call to Actions</h4>
                  <div className="space-y-3">
                    {hero.ctas.map((cta: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                        <EditableText 
                          value={typeof cta === 'string' ? cta : (cta.label || cta.text || 'CTA')} 
                          fieldPath={`content.landing_page.hero.ctas[${idx}]${typeof cta === 'string' ? '' : '.label'}`} 
                          className="text-white font-semibold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual & Social Proof */}
              <div className="grid md:grid-cols-2 gap-4">
                {hero.visual && (
                  <div className="p-5 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                    <h4 className="text-sm font-bold text-pink-400 uppercase mb-3">Visual Recommendation</h4>
                    <p className="text-[var(--text)] text-sm italic leading-relaxed">
                      <EditableText 
                        value={hero.visual} 
                        fieldPath="content.landing_page.hero.visual" 
                        className="text-[var(--text)] italic"
                        multiline
                      />
                    </p>
                  </div>
                )}
                {hero.social_proof_tag && (
                  <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                    <h4 className="text-sm font-bold text-cyan-400 uppercase mb-3">Social Proof Tag</h4>
                    <p className="text-[var(--text)] text-sm leading-relaxed">
                      <EditableText 
                        value={hero.social_proof_tag} 
                        fieldPath="content.landing_page.hero.social_proof_tag" 
                        className="text-[var(--text)]"
                        multiline
                      />
                    </p>
                  </div>
                )}
              </div>
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
                <p className="text-sm text-[var(--muted)]">Essential event information</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {overview.event_name && (
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2">Event Name</h4>
                  <p className="text-lg font-semibold text-[var(--text)]">
                    <EditableText 
                      value={overview.event_name} 
                      fieldPath="content.landing_page.overview.event_name" 
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
                      fieldPath="content.landing_page.overview.dates" 
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
                      fieldPath="content.landing_page.overview.location" 
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
                      fieldPath="content.landing_page.overview.value_proposition" 
                      className="text-base text-[var(--text)]"
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
                          fieldPath={`content.landing_page.overview.key_outcomes[${idx}]`} 
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
                  fieldPath="content.landing_page.target_audience.description" 
                  className="text-base text-[var(--text)]"
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
                        fieldPath={`content.landing_page.target_audience.fit_check[${idx}]`} 
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
                <p className="text-sm text-[var(--muted)]">Learn from industry leaders</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {speakers.items.map((speaker: any, idx: number) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                  <h3 className="text-xl font-bold text-orange-400 mb-2">
                    <EditableText 
                      value={speaker.name} 
                      fieldPath={`content.landing_page.speakers.items[${idx}].name`} 
                      className="text-xl font-bold text-orange-400"
                    />
                  </h3>
                  {speaker.title && <p className="text-sm text-[var(--muted)] mb-3">
                    <EditableText 
                      value={speaker.title} 
                      fieldPath={`content.landing_page.speakers.items[${idx}].title`} 
                      className="text-sm text-[var(--muted)]"
                    />
                  </p>}
                  {(speaker.bio || speaker.value_bio) && (
                    <p className="text-sm text-[var(--text)] leading-relaxed mb-3">
                      <EditableText 
                        value={speaker.bio || speaker.value_bio} 
                        fieldPath={`content.landing_page.speakers.items[${idx}].${speaker.bio ? 'bio' : 'value_bio'}`} 
                        className="text-sm text-[var(--text)]"
                        multiline
                      />
                    </p>
                  )}
                  {speaker.session_focus && (
                    <div className="mt-3 pt-3 border-t border-orange-500/20">
                      <p className="text-xs font-bold text-orange-400 uppercase mb-1">Session Focus</p>
                      <p className="text-sm text-[var(--text)]">
                        <EditableText 
                          value={speaker.session_focus} 
                          fieldPath={`content.landing_page.speakers.items[${idx}].session_focus`} 
                          className="text-sm text-[var(--text)]"
                          multiline
                        />
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {speakers.sponsors && Array.isArray(speakers.sponsors) && (
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-400 uppercase mb-4">Event Sponsors</h4>
                <div className="flex flex-wrap gap-3">
                  {speakers.sponsors.map((sponsor: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold">
                      <EditableText 
                        value={sponsor} 
                        fieldPath={`content.landing_page.speakers.sponsors[${idx}]`} 
                        className="text-cyan-300"
                      />
                    </span>
                  ))}
                </div>
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
                <p className="text-sm text-[var(--muted)]">Complete agenda</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {schedule.days.map((day: any, idx: number) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
                  <h3 className="text-xl font-bold text-green-400 mb-4">{day.day || `Day ${idx + 1}`}</h3>
                  {day.date && <p className="text-sm text-[var(--muted)] mb-4">{day.date}</p>}
                  
                  {day.sessions && Array.isArray(day.sessions) && (
                    <div className="space-y-4">
                      {day.sessions.map((session: any, sIdx: number) => (
                        <div key={sIdx} className="pl-4 border-l-2 border-green-500/30">
                          {session.time && <p className="text-xs font-bold text-green-400 mb-1">
                            <EditableText 
                              value={session.time} 
                              fieldPath={`content.landing_page.schedule.days[${idx}].sessions[${sIdx}].time`} 
                              className="text-xs font-bold text-green-400"
                            />
                          </p>}
                          <p className="text-base font-semibold text-[var(--text)] mb-1">
                            <EditableText 
                              value={session.title || session.name} 
                              fieldPath={`content.landing_page.schedule.days[${idx}].sessions[${sIdx}].${session.title ? 'title' : 'name'}`} 
                              className="text-base font-semibold text-[var(--text)]"
                            />
                          </p>
                          {session.description && <p className="text-sm text-[var(--muted)] leading-relaxed">
                            <EditableText 
                              value={session.description} 
                              fieldPath={`content.landing_page.schedule.days[${idx}].sessions[${sIdx}].description`} 
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

      {/* Ticketing Section */}
      {ticketing.tiers && Array.isArray(ticketing.tiers) && ticketing.tiers.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-yellow-500/30 backdrop-blur-sm shadow-xl shadow-yellow-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎟️</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Ticket Options</h2>
                <p className="text-sm text-[var(--muted)]">Choose your package</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {ticketing.tiers.map((tier: any, idx: number) => (
                <div
                  key={idx}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    tier.badge
                      ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                      : 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50'
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold shadow-lg">
                        {tier.badge}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-white mb-4 mt-2">{tier.name}</h3>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-green-400">{tier.price}</span>
                    {tier.original_price && (
                      <span className="ml-2 text-lg text-[var(--muted)] line-through">
                        {tier.original_price}
                      </span>
                    )}
                  </div>
                  
                  {tier.benefits && Array.isArray(tier.benefits) && (
                    <ul className="space-y-3 mb-6">
                      {tier.benefits.map((benefit: string, bIdx: number) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                          <span className="text-[var(--text)] text-sm leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            
            {(ticketing.urgency || ticketing.guarantee) && (
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {ticketing.urgency && Array.isArray(ticketing.urgency) && (
                  <div className="p-5 rounded-lg bg-red-500/10 border border-red-500/30">
                    <h4 className="text-sm font-bold text-red-400 uppercase mb-3">⚡ Urgency</h4>
                    <ul className="space-y-2">
                      {ticketing.urgency.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm text-red-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {ticketing.guarantee && (
                  <div className="p-5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center text-center">
                    <div>
                      <span className="text-3xl mb-2 block">🛡️</span>
                      <p className="text-sm text-green-300 font-semibold">{ticketing.guarantee}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Testimonials Section */}
      {testimonials.items && Array.isArray(testimonials.items) && testimonials.items.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-cyan-500/30 backdrop-blur-sm shadow-xl shadow-cyan-500/10">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Success Stories</h2>
                <p className="text-sm text-[var(--muted)]">Hear from past attendees</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.items.map((testimonial: any, idx: number) => (
                <div key={idx} className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20">
                  {testimonial.pull_quote && (
                    <p className="text-lg italic text-cyan-300 mb-4 leading-relaxed">
                      &ldquo;<EditableText 
                        value={testimonial.pull_quote} 
                        fieldPath={`content.landing_page.testimonials.items[${idx}].pull_quote`} 
                        className="text-lg italic text-cyan-300"
                        multiline
                      />&rdquo;
                    </p>
                  )}
                  
                  <div className="space-y-3 text-sm">
                    {testimonial.before && (
                      <div>
                        <span className="text-xs font-bold text-red-400 uppercase block mb-1">Before</span>
                        <p className="text-[var(--text)] leading-relaxed">
                          <EditableText 
                            value={testimonial.before} 
                            fieldPath={`content.landing_page.testimonials.items[${idx}].before`} 
                            className="text-[var(--text)]"
                            multiline
                          />
                        </p>
                      </div>
                    )}
                    {testimonial.experience && (
                      <div>
                        <span className="text-xs font-bold text-yellow-400 uppercase block mb-1">Experience</span>
                        <p className="text-[var(--text)] leading-relaxed">
                          <EditableText 
                            value={testimonial.experience} 
                            fieldPath={`content.landing_page.testimonials.items[${idx}].experience`} 
                            className="text-[var(--text)]"
                            multiline
                          />
                        </p>
                      </div>
                    )}
                    {testimonial.after && (
                      <div>
                        <span className="text-xs font-bold text-green-400 uppercase block mb-1">After</span>
                        <p className="text-[var(--text)] leading-relaxed">
                          <EditableText 
                            value={testimonial.after} 
                            fieldPath={`content.landing_page.testimonials.items[${idx}].after`} 
                            className="text-[var(--text)]"
                            multiline
                          />
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {testimonial.author && (
                    <p className="text-sm text-[var(--muted)] text-right mt-4 pt-4 border-t border-cyan-500/20">
                      — <EditableText 
                        value={testimonial.author} 
                        fieldPath={`content.landing_page.testimonials.items[${idx}].author`} 
                        className="text-sm text-[var(--muted)]"
                      />
                    </p>
                  )}
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
                <h2 className="text-2xl font-bold text-indigo-400 mb-2">FAQ</h2>
                <p className="text-sm text-[var(--muted)]">Common questions answered</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {faq.items.map((item: any, idx: number) => (
                <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
                  <h4 className="text-base font-semibold text-indigo-400 mb-2">
                    <EditableText 
                      value={item.question} 
                      fieldPath={`content.landing_page.faq.items[${idx}].question`} 
                      className="text-base font-semibold text-indigo-400"
                      multiline
                    />
                  </h4>
                  <p className="text-sm text-[var(--text)] leading-relaxed">
                    <EditableText 
                      value={item.answer} 
                      fieldPath={`content.landing_page.faq.items[${idx}].answer`} 
                      className="text-sm text-[var(--text)]"
                      multiline
                    />
                  </p>
                </div>
              ))}
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
                <p className="text-sm text-[var(--muted)]">Strategic placement guide</p>
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
                      {button.style || 'secondary'}
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

// Read-only version without inline editing
function LandingPageReadOnly({ data, inputs }: { data: Record<string, unknown>; inputs?: Record<string, unknown> }) {
  // Handle new sections-based structure
  if (data.sections && Array.isArray(data.sections)) {
    return <LandingPageSectionsDisplay data={data} inputs={inputs} />;
  }
  
  const content = (data.content || data) as any;
  const landingPage = content.landing_page || content;
  const hero = landingPage.hero || {};
  const overview = landingPage.overview || {};

  const generateFormattedText = () => {
    let text = '=== EVENT LANDING PAGE ===\n\n';
    if (hero.headline) {
      text += `HEADLINE: ${hero.headline}\n`;
      if (hero.subheadline) text += `SUBHEADLINE: ${hero.subheadline}\n`;
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
    <div className="space-y-10">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-2xl shadow-orange-500/50 hover:scale-105 transition-transform duration-300">
          <span className="text-5xl">🚀</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
          Event Landing Page
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
          Your high-converting landing page blueprint
        </p>
      </div>

      {/* Original Input Display */}
      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      <div className="flex justify-center gap-4 flex-wrap">
        <CopyButton text={formattedText} label="Copy" />
        <DownloadButton content={formattedText} filename="landing-page-blueprint.pdf" label="Download PDF" theme={{ primary: '#f59e0b', secondary: '#ef4444', title: 'Landing Page Blueprint' }} />
      </div>
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-orange-500/30 backdrop-blur-sm shadow-xl shadow-orange-500/10">
        <CardContent className="pt-8">
          <p className="text-[var(--text)] text-center">
            ⚠️ Inline editing is not available in read-only mode. Full content is displayed for viewing and copying.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
/**
 * Recursively render any value type dynamically with improved styling
 */
function renderValue(value: any, depth: number = 0): React.ReactNode {
  // Null or undefined
  if (value === null || value === undefined) {
    return <span className="text-[var(--muted)] italic text-sm">N/A</span>;
  }

  // String
  if (typeof value === 'string') {
    // Check if it's a longer paragraph
    if (value.length > 150) {
      return <p className="text-[var(--text)] leading-relaxed text-base">{value}</p>;
    }
    return <span className="text-[var(--text)] text-base">{value}</span>;
  }

  // Number or boolean
  if (typeof value === 'number' || typeof value === 'boolean') {
    return <span className="text-[var(--text)] font-medium">{String(value)}</span>;
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-[var(--muted)] italic text-sm">Empty list</span>;
    }
    return (
      <ul className="space-y-3">
        {value.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 group">
            <span className="text-orange-400 mt-1.5 flex-shrink-0 text-sm group-hover:scale-110 transition-transform">●</span>
            <div className="flex-1">{renderValue(item, depth + 1)}</div>
          </li>
        ))}
      </ul>
    );
  }

  // Object
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return <span className="text-[var(--muted)] italic text-sm">Empty object</span>;
    }

    // Check if this looks like a structured object with common keys
    const hasLabel = 'label' in value || 'title' in value || 'name' in value;
    const hasText = 'text' in value || 'content' in value || 'description' in value;

    // Render structured objects more compactly
    if (hasLabel && hasText && entries.length <= 3) {
      const label = value.label || value.title || value.name;
      const text = value.text || value.content || value.description;
      return (
        <div className="space-y-2">
          {label && <div className="font-semibold text-orange-400 text-base">{label}</div>}
          {text && <div className="text-[var(--text)] text-base leading-relaxed">{text}</div>}
        </div>
      );
    }

    // Render as key-value pairs
    return (
      <div className={depth === 0 ? "space-y-4" : "space-y-3 ml-4 pl-4 border-l-2 border-orange-500/20"}>
        {entries.map(([key, val]) => (
          <div key={key} className="space-y-2">
            <div className="text-xs font-bold text-orange-400/80 uppercase tracking-wider">
              {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div>{renderValue(val, depth + 1)}</div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback for unknown types
  return <span className="text-[var(--muted)] text-sm">{String(value)}</span>;
}

/**
 * Display component for sections-based landing page structure WITH INLINE EDITING
 * Handles the new format: { meta, event, sections: [] }
 */
function LandingPageSectionsDisplayEditable({ 
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
  const sections = (data.sections || []) as any[];
  const event = (data.event || {}) as any;
  const meta = (data.meta || {}) as any;

  // Sort sections by priority - hero/headline first, then logical order
  const sortedSections = [...sections].sort((a, b) => {
    const getOrderPriority = (section: any) => {
      const title = (section.title || '').toLowerCase();
      if (title.includes('hero') || title.includes('headline') || title.includes('strapline')) return 0;
      if (title.includes('social proof') || title.includes('stats')) return 1;
      if (title.includes('discover') || title.includes('learn') || title.includes('what you')) return 2;
      if (title.includes('perfect for') || title.includes('audience') || title.includes('who')) return 3;
      if (title.includes('secret') || title.includes('bonus')) return 4;
      if (title.includes('speaker') || title.includes('facilitator') || title.includes('expert') || title.includes('meet')) return 5;
      if (title.includes('testimonial') || title.includes('saying') || title.includes('review')) return 6;
      if (title.includes('schedule') || title.includes('agenda') || title.includes('happen')) return 7;
      if (title.includes('bonus') || title.includes('exclusive')) return 8;
      if (title.includes('faq') || title.includes('question')) return 9;
      if (title.includes('register') || title.includes('form')) return 10;
      if (title.includes('cta') || title.includes('action')) return 11;
      return 50; // Unknown sections go near the end
    };
    return getOrderPriority(a) - getOrderPriority(b);
  });

  // Generate formatted text for copy
  const generateFormattedText = () => {
    let text = '=== EVENT LANDING PAGE ===\n\n';
    
    if (event.name) {
      text += `EVENT: ${event.name}\n`;
      if (event.dates) text += `DATES: ${event.dates}\n`;
      if (event.location) text += `LOCATION: ${event.location}\n`;
      text += '\n';
    }
    
    sections.forEach((section: any) => {
      if (section.title) {
        text += `\n${section.title.toUpperCase()}\n`;
        if (section.content) {
          if (typeof section.content === 'string') {
            text += `${section.content}\n`;
          } else if (Array.isArray(section.content)) {
            section.content.forEach((item: any) => {
              text += `- ${typeof item === 'string' ? item : JSON.stringify(item)}\n`;
            });
          }
        }
      }
    });
    
    return text;
  };

  const formattedText = generateFormattedText();

  // Helper function to render editable values
  const renderEditableValue = (value: any, fieldPath: string, depth: number = 0): React.ReactNode => {
    // Null or undefined
    if (value === null || value === undefined) {
      return <span className="text-[var(--muted)] italic text-sm">N/A</span>;
    }

    // String - Make it editable
    if (typeof value === 'string') {
      return (
        <EditableText 
          value={value} 
          fieldPath={fieldPath} 
          className="text-[var(--text)]"
          multiline={value.length > 150}
        />
      );
    }

    // Number or boolean
    if (typeof value === 'number' || typeof value === 'boolean') {
      return (
        <EditableText 
          value={String(value)} 
          fieldPath={fieldPath} 
          className="text-[var(--text)] font-medium"
        />
      );
    }

    // Array
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-[var(--muted)] italic text-sm">Empty list</span>;
      }
      return (
        <ul className="space-y-3">
          {value.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 group">
              <span className="text-orange-400 mt-1.5 flex-shrink-0 text-sm group-hover:scale-110 transition-transform">●</span>
              <div className="flex-1">{renderEditableValue(item, `${fieldPath}[${idx}]`, depth + 1)}</div>
            </li>
          ))}
        </ul>
      );
    }

    // Object
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <span className="text-[var(--muted)] italic text-sm">Empty object</span>;
      }

      // Check if this looks like a structured object with common keys
      const hasLabel = 'label' in value || 'title' in value || 'name' in value;
      const hasText = 'text' in value || 'content' in value || 'description' in value;

      // Render structured objects more compactly
      if (hasLabel && hasText && entries.length <= 3) {
        const label = value.label || value.title || value.name;
        const text = value.text || value.content || value.description;
        return (
          <div className="space-y-2">
            {label && <div className="font-semibold text-orange-400 text-base">
              <EditableText 
                value={label} 
                fieldPath={`${fieldPath}.${value.label ? 'label' : value.title ? 'title' : 'name'}`} 
                className="font-semibold text-orange-400"
              />
            </div>}
            {text && <div className="text-[var(--text)] text-base leading-relaxed">
              <EditableText 
                value={text} 
                fieldPath={`${fieldPath}.${value.text ? 'text' : value.content ? 'content' : 'description'}`} 
                className="text-[var(--text)]"
                multiline
              />
            </div>}
          </div>
        );
      }

      // Render as key-value pairs
      return (
        <div className={depth === 0 ? "space-y-4" : "space-y-3 ml-4 pl-4 border-l-2 border-orange-500/20"}>
          {entries.map(([key, val]) => (
            <div key={key} className="space-y-2">
              <div className="text-xs font-bold text-orange-400/80 uppercase tracking-wider">
                {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div>{renderEditableValue(val, `${fieldPath}.${key}`, depth + 1)}</div>
            </div>
          ))}
        </div>
      );
    }

    // Fallback for unknown types
    return <span className="text-[var(--muted)] text-sm">{String(value)}</span>;
  };

  return (
    <div className="space-y-10">
      {/* Blueprint Header - Make it clear this is a guide */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-500/50">
          <span className="text-4xl">📋</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
          Your Landing Page Blueprint
        </h1>
        <p className="text-lg md:text-xl text-[var(--muted)] max-w-4xl mx-auto leading-relaxed">
          Below is a recommended structure for your landing page. Use this as a guide to create your high-converting event landing page.
        </p>
      </div>

      {/* Original Input Display */}
      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      {/* Utility Buttons - Copy and Download */}
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="transform hover:scale-105 transition-transform duration-200">
          <CopyButton text={formattedText} label="Copy" />
        </div>
        <div className="transform hover:scale-105 transition-transform duration-200">
          <DownloadButton content={formattedText} filename="landing-page-blueprint" label="Open in Google Docs" theme={{ primary: '#f59e0b', secondary: '#ef4444', title: 'Landing Page Blueprint' }} />
        </div>

      </div>

      {/* Event Details Section */}
      {event.name && (
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-l-4 border-orange-500 backdrop-blur-sm shadow-2xl">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-orange-400">Event Details Header</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">Section 1</span>
                </div>
                <p className="text-sm text-[var(--muted)] mb-4">Place this at the very top of your landing page</p>
              </div>
            </div>
            
            <div className="space-y-4 pl-16">
              {event.name && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                  <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Event Title:</p>
                  <p className="text-2xl md:text-3xl text-[var(--text)] font-bold leading-tight">
                    <EditableText 
                      value={event.name} 
                      fieldPath="event.name" 
                      className="text-2xl md:text-3xl text-[var(--text)] font-bold"
                      multiline
                    />
                  </p>
                </div>
              )}
              
              {event.dates && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                  <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Recommended Format:</p>
                  <p className="text-base text-[var(--text)] font-medium">
                    <EditableText 
                      value={event.dates} 
                      fieldPath="event.dates" 
                      className="text-base text-[var(--text)]"
                    />
                  </p>
                </div>
              )}
              
              {event.subtitle && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                  <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Subtitle/Hook:</p>
                  <p className="text-lg text-[var(--text)] leading-relaxed">
                    <EditableText 
                      value={event.subtitle} 
                      fieldPath="event.subtitle" 
                      className="text-lg text-[var(--text)]"
                      multiline
                    />
                  </p>
                </div>
              )}
              
              {event.location && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                  <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Location:</p>
                  <p className="text-base text-cyan-400">
                    📍 <EditableText 
                      value={event.location} 
                      fieldPath="event.location" 
                      className="text-base text-cyan-400"
                    />
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Sections with Editing */}
      {sortedSections.map((section: any, idx: number) => {
        const getSectionStyle = () => {
          const title = (section.title || '').toLowerCase();
          
          if (title.includes('hero') || title.includes('headline')) {
            return {
              gradient: 'from-orange-500/10 to-red-500/10',
              border: 'border-l-4 border-orange-500',
              iconBg: 'bg-orange-500/20 border border-orange-500/40',
              titleColor: 'text-orange-400',
              badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
              icon: section.icon || '🎯'
            };
          }
          if (title.includes('audience') || title.includes('who') || title.includes('perfect for')) {
            return {
              gradient: 'from-purple-500/10 to-pink-500/10',
              border: 'border-l-4 border-purple-500',
              iconBg: 'bg-purple-500/20 border border-purple-500/40',
              titleColor: 'text-purple-400',
              badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
              icon: section.icon || '👥'
            };
          }
          // ... other styles
          return {
            gradient: 'from-blue-500/10 to-indigo-500/10',
            border: 'border-l-4 border-blue-500',
            iconBg: 'bg-blue-500/20 border border-blue-500/40',
            titleColor: 'text-blue-400',
            badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            icon: section.icon || '📄'
          };
        };
        
        const style = getSectionStyle();
        const sectionNumber = idx + 2;
        
        return (
          <Card key={idx} className={`bg-gradient-to-br from-slate-900/90 to-slate-800/90 ${style.border} backdrop-blur-sm shadow-2xl transition-all duration-300`}>
            <CardContent className="pt-8">
              {section.id && (
                <div className="mb-4">
                  <span className={`inline-block text-xs font-bold ${style.titleColor}/60 uppercase tracking-wider px-3 py-1 rounded-full ${style.badgeColor} border`}>
                    🏷️ {section.id.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
              
              {section.title && (
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg ${style.iconBg} flex items-center justify-center`}>
                      <span className="text-2xl">{style.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className={`text-xl md:text-2xl font-bold ${style.titleColor}`}>
                        <EditableText 
                          value={section.title} 
                          fieldPath={`sections[${idx}].title`} 
                          className={`text-xl md:text-2xl font-bold ${style.titleColor}`}
                        />
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${style.badgeColor} border`}>
                        Section {sectionNumber}
                      </span>
                    </div>
                    {section.description && (
                      <p className="text-sm text-[var(--muted)] leading-relaxed">
                        <EditableText 
                          value={section.description} 
                          fieldPath={`sections[${idx}].description`} 
                          className="text-sm text-[var(--muted)]"
                          multiline
                        />
                      </p>
                    )}
                    <p className="text-xs text-[var(--muted)]/60 mt-2 italic">Add this section to your landing page in this order</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-6 pl-0 md:pl-16">
                {section.content && (
                  <div className={`p-6 rounded-xl bg-gradient-to-br ${style.gradient} border ${style.border.replace('border-l-4', 'border')} transition-all duration-300`}>
                    <div className="mb-3">
                      <span className={`text-xs font-semibold ${style.titleColor} uppercase tracking-wider`}>📝 Recommended Content:</span>
                    </div>
                    {renderEditableValue(section.content, `sections[${idx}].content`, 0)}
                  </div>
                )}

                {/* Render additional fields if present - EXCLUDING 'id' */}
                {Object.entries(section)
                  .filter(([key]) => key !== 'title' && key !== 'description' && key !== 'icon' && key !== 'content' && key !== 'id')
                  .map(([key, value]) => (
                    value ? (
                      <div key={key} className={`p-6 rounded-xl bg-gradient-to-br ${style.gradient} border ${style.border.replace('border-l-4', 'border')} transition-all duration-300`}>
                        <h4 className={`text-sm font-bold ${style.titleColor} uppercase mb-4 tracking-wider flex items-center gap-2`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        {renderEditableValue(value, `sections[${idx}].${key}`, 0)}
                      </div>
                    ) : null
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Metadata */}
      {meta.notes && Array.isArray(meta.notes) && meta.notes.length > 0 && (
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
                  {meta.notes.map((note: string, idx: number) => (
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

/**
 * Display component for sections-based landing page structure (READ-ONLY)
 * Handles the new format: { meta, event, sections: [] }
 */
function LandingPageSectionsDisplay({ data, inputs }: { data: Record<string, unknown>; inputs?: Record<string, unknown> }) {
  const sections = (data.sections || []) as any[];
  const event = (data.event || {}) as any;
  const meta = (data.meta || {}) as any;

  // Sort sections by priority - hero/headline first, then logical order
  const sortedSections = [...sections].sort((a, b) => {
    const getOrderPriority = (section: any) => {
      const title = (section.title || '').toLowerCase();
      if (title.includes('hero') || title.includes('headline') || title.includes('strapline')) return 0;
      if (title.includes('social proof') || title.includes('stats')) return 1;
      if (title.includes('discover') || title.includes('learn') || title.includes('what you')) return 2;
      if (title.includes('perfect for') || title.includes('audience') || title.includes('who')) return 3;
      if (title.includes('secret') || title.includes('bonus')) return 4;
      if (title.includes('speaker') || title.includes('facilitator') || title.includes('expert') || title.includes('meet')) return 5;
      if (title.includes('testimonial') || title.includes('saying') || title.includes('review')) return 6;
      if (title.includes('schedule') || title.includes('agenda') || title.includes('happen')) return 7;
      if (title.includes('bonus') || title.includes('exclusive')) return 8;
      if (title.includes('faq') || title.includes('question')) return 9;
      if (title.includes('register') || title.includes('form')) return 10;
      if (title.includes('cta') || title.includes('action')) return 11;
      return 50; // Unknown sections go near the end
    };
    return getOrderPriority(a) - getOrderPriority(b);
  });

  // Generate formatted text for copy
  const generateFormattedText = () => {
    let text = '=== EVENT LANDING PAGE ===\n\n';
    
    if (event.name) {
      text += `EVENT: ${event.name}\n`;
      if (event.dates) text += `DATES: ${event.dates}\n`;
      if (event.location) text += `LOCATION: ${event.location}\n`;
      text += '\n';
    }
    
    sections.forEach((section: any) => {
      if (section.title) {
        text += `\n${section.title.toUpperCase()}\n`;
        if (section.content) {
          if (typeof section.content === 'string') {
            text += `${section.content}\n`;
          } else if (Array.isArray(section.content)) {
            section.content.forEach((item: any) => {
              text += `- ${typeof item === 'string' ? item : JSON.stringify(item)}\n`;
            });
          }
        }
      }
    });
    
    return text;
  };

  const formattedText = generateFormattedText();

  return (
    <div className="space-y-10">
      {/* Blueprint Header - Make it clear this is a guide */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl shadow-orange-500/50">
          <span className="text-4xl">📋</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight">
          Your Landing Page Blueprint
        </h1>
        <p className="text-lg md:text-xl text-[var(--muted)] max-w-4xl mx-auto leading-relaxed">
          Below is a recommended structure for your landing page. Use this as a guide to create your high-converting event landing page.
        </p>
      </div>

      {/* Original Input Display */}
      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      {/* Utility Buttons - Copy and Download */}
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="transform hover:scale-105 transition-transform duration-200">
          <CopyButton text={formattedText} label="Copy" />
        </div>
        <div className="transform hover:scale-105 transition-transform duration-200">
          <DownloadButton content={formattedText} filename="landing-page-blueprint" label="Open in Google Docs" theme={{ primary: '#f59e0b', secondary: '#ef4444', title: 'Landing Page Blueprint' }} />
        </div>
      </div>

      {/* Event Details Section - Show as example */}
      {event.name && (
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-l-4 border-orange-500 backdrop-blur-sm shadow-2xl">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-orange-400">Event Details Header</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">Section 1</span>
                </div>
                <p className="text-sm text-[var(--muted)] mb-4">Place this at the very top of your landing page</p>
              </div>
            </div>
            
            <div className="space-y-4 pl-16">
              <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Recommended Format:</p>
                <p className="text-base text-[var(--text)] font-medium">
                  {event.dates && `FREE 90-MINUTE LIVE MASTERCLASS | ${event.dates}`}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Event Title:</p>
                <p className="text-2xl md:text-3xl text-[var(--text)] font-bold leading-tight">
                  {event.name}
                </p>
              </div>
              
              {event.subtitle && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                  <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Subtitle/Hook:</p>
                  <p className="text-lg text-[var(--text)] leading-relaxed">
                    {event.subtitle}
                  </p>
                </div>
              )}
              
              {event.location && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                  <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Location:</p>
                  <p className="text-base text-cyan-400">
                    📍 {event.location}
                  </p>
                </div>
              )}
              
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">💡 Recommended CTA Placement:</p>
                <div className="space-y-2">
                  <p className="text-sm text-[var(--muted)]">Add a prominent call-to-action button here:</p>
                  <div className="inline-block px-6 py-3 bg-green-500/20 border-2 border-green-500/50 rounded-lg text-green-300 font-bold">
                    Example: "REGISTER NOW - IT'S FREE"
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Sections - Sorted by priority */}
      {sortedSections.map((section: any, idx: number) => {
        // Determine section color and icon based on title/content
        const getSectionStyle = () => {
          const title = (section.title || '').toLowerCase();
          
          if (title.includes('hero') || title.includes('headline')) {
            return {
              gradient: 'from-orange-500/10 to-red-500/10',
              border: 'border-l-4 border-orange-500',
              iconBg: 'bg-orange-500/20 border border-orange-500/40',
              titleColor: 'text-orange-400',
              badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
              icon: section.icon || '🎯'
            };
          }
          if (title.includes('audience') || title.includes('who') || title.includes('perfect for')) {
            return {
              gradient: 'from-purple-500/10 to-pink-500/10',
              border: 'border-l-4 border-purple-500',
              iconBg: 'bg-purple-500/20 border border-purple-500/40',
              titleColor: 'text-purple-400',
              badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
              icon: section.icon || '👥'
            };
          }
          if (title.includes('ticket') || title.includes('pricing') || title.includes('price')) {
            return {
              gradient: 'from-yellow-500/10 to-orange-500/10',
              border: 'border-l-4 border-yellow-500',
              iconBg: 'bg-yellow-500/20 border border-yellow-500/40',
              titleColor: 'text-yellow-400',
              badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
              icon: section.icon || '🎫'
            };
          }
          if (title.includes('speaker') || title.includes('expert') || title.includes('facilitator')) {
            return {
              gradient: 'from-red-500/10 to-orange-500/10',
              border: 'border-l-4 border-red-500',
              iconBg: 'bg-red-500/20 border border-red-500/40',
              titleColor: 'text-red-400',
              badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
              icon: section.icon || '🎤'
            };
          }
          if (title.includes('testimonial') || title.includes('review') || title.includes('social proof') || title.includes('stats')) {
            return {
              gradient: 'from-cyan-500/10 to-blue-500/10',
              border: 'border-l-4 border-cyan-500',
              iconBg: 'bg-cyan-500/20 border border-cyan-500/40',
              titleColor: 'text-cyan-400',
              badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
              icon: section.icon || '💬'
            };
          }
          if (title.includes('cta') || title.includes('action') || title.includes('register')) {
            return {
              gradient: 'from-green-500/10 to-emerald-500/10',
              border: 'border-l-4 border-green-500',
              iconBg: 'bg-green-500/20 border border-green-500/40',
              titleColor: 'text-green-400',
              badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
              icon: section.icon || '🚀'
            };
          }
          
          // Default style
          return {
            gradient: 'from-blue-500/10 to-indigo-500/10',
            border: 'border-l-4 border-blue-500',
            iconBg: 'bg-blue-500/20 border border-blue-500/40',
            titleColor: 'text-blue-400',
            badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            icon: section.icon || '📄'
          };
        };
        
        const style = getSectionStyle();
        const sectionNumber = idx + 2; // Start from 2 since event details is section 1
        
        return (
          <Card key={idx} className={`bg-gradient-to-br from-slate-900/90 to-slate-800/90 ${style.border} backdrop-blur-sm shadow-2xl transition-all duration-300`}>
            <CardContent className="pt-8">
              {/* Section ID at the top */}
              {section.id && (
                <div className="mb-4">
                  <span className={`inline-block text-xs font-bold ${style.titleColor}/60 uppercase tracking-wider px-3 py-1 rounded-full ${style.badgeColor} border`}>
                    🏷️ {section.id.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
              
              {section.title && (
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg ${style.iconBg} flex items-center justify-center`}>
                      <span className="text-2xl">{style.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className={`text-xl md:text-2xl font-bold ${style.titleColor}`}>{section.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${style.badgeColor} border`}>
                        Section {sectionNumber}
                      </span>
                    </div>
                    {section.description && (
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{section.description}</p>
                    )}
                    <p className="text-xs text-[var(--muted)]/60 mt-2 italic">Add this section to your landing page in this order</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-6 pl-0 md:pl-16">
                {/* Render content dynamically based on type */}
                {section.content ? (
                  <div className={`p-6 rounded-xl bg-gradient-to-br ${style.gradient} border ${style.border.replace('border-l-4', 'border')} transition-all duration-300`}>
                    <div className="mb-3">
                      <span className={`text-xs font-semibold ${style.titleColor} uppercase tracking-wider`}>📝 Recommended Content:</span>
                    </div>
                    {renderValue(section.content, 0)}
                  </div>
                ) : null}

                {/* Render additional fields if present - EXCLUDING 'id' */}
                {Object.entries(section)
                  .filter(([key]) => key !== 'title' && key !== 'description' && key !== 'icon' && key !== 'content' && key !== 'id')
                  .map(([key, value]) => (
                    value ? (
                      <div key={key} className={`p-6 rounded-xl bg-gradient-to-br ${style.gradient} border ${style.border.replace('border-l-4', 'border')} transition-all duration-300`}>
                        <h4 className={`text-sm font-bold ${style.titleColor} uppercase mb-4 tracking-wider flex items-center gap-2`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        {renderValue(value, 0)}
                      </div>
                    ) : null
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Metadata */}
      {meta.notes && Array.isArray(meta.notes) && meta.notes.length > 0 && (
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
                  {meta.notes.map((note: string, idx: number) => (
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
