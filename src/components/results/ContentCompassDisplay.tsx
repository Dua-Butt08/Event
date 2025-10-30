"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Card, CardContent } from '@/components/ui/card';
import { OriginalInputDisplay } from '@/components/shared/OriginalInputDisplay';
import { formatContentCompassText } from '@/lib/format-utils';
import { InlineEditableContent, SaveToolbar } from '@/components/shared/InlineEditableContent';

interface ContentCompassDisplayProps {
  data: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  onUpdate?: (updatedData: Record<string, unknown>) => Promise<void>;
  isUpdating?: boolean;
}

interface ICPProfile {
  icp: string;
  sections: ProfileSection[];
}

interface ProfileSection {
  id: string;
  heading: string;
  problems?: string[];
  emotions?: string[];
  obstacles?: string[];
  ethical_tensions?: string[];
  business_transformation?: string[];
  mindset_shifts?: string[];
  tangible_results?: string[];
  values_realised?: string[];
  core_values?: string[];
  guiding_beliefs?: string[];
  ethical_priorities?: string[];
  meaning_drivers?: string[];
  items?: any[];
  content?: string;
  reveals_values?: string[];
  alignment_notes?: string[];
  meaning_meets_motivation?: string[];
  trust_builders?: string[];
  journey_recommendations?: {
    awareness?: string[];
    consideration?: string[];
    decision?: string[];
  };
}

// New interfaces for ClientValueMap format
interface Milestone {
  id: string;
  title: string;
  importance: string;
  sub_topics: string[];
  content_types: string[];
}

interface ClientValueMap {
  current_state?: {
    heading: string;
    description: string;
  };
  desired_state?: {
    heading: string;
    description: string;
  };
  key_milestones?: Milestone[];
  transformation_summary?: {
    heading: string;
    description: string;
  };
  content_strategy_overview?: {
    heading: string;
    description: string;
  };
}

export function ContentCompassDisplay({ data, inputs, onUpdate, isUpdating = false }: ContentCompassDisplayProps) {
  if (!onUpdate) {
    // Read-only mode
    return <ContentCompassReadOnly data={data} inputs={inputs} />;
  }

  return (
    <InlineEditableContent data={data} onUpdate={onUpdate} isUpdating={isUpdating}>
      {({ localData, EditableText, hasChanges, saveAll, cancelAll }) => (
        <ContentCompassEditable
          data={localData}
          inputs={inputs}
          EditableText={EditableText}
          hasChanges={hasChanges}
          saveAll={saveAll}
          cancelAll={cancelAll}
          isUpdating={isUpdating}
        />
      )}
    </InlineEditableContent>
  );
}

function ContentCompassEditable({
  data,
  inputs,
  EditableText,
  hasChanges,
  saveAll,
  cancelAll,
  isUpdating
}: {
  data: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  EditableText: React.ComponentType<any>;
  hasChanges: boolean;
  saveAll: () => Promise<void>;
  cancelAll: () => void;
  isUpdating?: boolean;
}) {
  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  const profiles = (data.profiles as ICPProfile[]) || [];
  const valueMap = data.map as ClientValueMap | undefined;

  // Generate formatted text for copy and download
 const formattedText = formatContentCompassText(data);

  return (
    <div className="space-y-8">
      {/* Global Save Toolbar */}
      <SaveToolbar
        hasChanges={hasChanges}
        saveAll={saveAll}
        cancelAll={cancelAll}
        isUpdating={isUpdating}
        position="top"
      />
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
          <span className="text-4xl">🧭</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
          {header?.title || 'CONTENT COMPASS™'}
        </h1>
        {header?.subtitle && (
          <p className="text-xl font-semibold text-[var(--text)] mb-2">{header.subtitle}</p>
        )}
        {header?.tagline && (
          <p className="text-lg text-[var(--muted)] max-w-3xl mx-auto italic">{header.tagline}</p>
        )}
      </div>

      {/* Original Input Display */}
      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <CopyButton text={formattedText} label="Copy" />
        <DownloadButton content={formattedText} filename="content-compass-strategy" label="Open in Google Docs" theme={{ primary: '#10b981', secondary: '#22d3ee', title: 'Content Compass Strategy' }} />
      </div>

      {/* ClientValueMap Format - New Structure */}
      {valueMap && (
            <div className="space-y-6">
              {/* Current State (Point A) */}
              {valueMap.current_state && (() => {
                const currentStateText = `## ${valueMap.current_state.heading}\n\n${valueMap.current_state.description}`;
                return (
                  <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">📍</span>
                        <div className="flex-1">
                          <EditableText
                            value={currentStateText}
                            fieldPath="map.current_state"
                            className="text-[var(--text)]"
                            multiline
                            renderMarkdown
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Desired State (Point B) */}
              {valueMap.desired_state && (() => {
                const desiredStateText = `## ${valueMap.desired_state.heading}\n\n${valueMap.desired_state.description}`;
                return (
                  <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">🎯</span>
                        <div className="flex-1">
                          <EditableText
                            value={desiredStateText}
                            fieldPath="map.desired_state"
                            className="text-[var(--text)]"
                            multiline
                            renderMarkdown
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Key Milestones - Dynamic Count */}
              {valueMap.key_milestones && valueMap.key_milestones.length > 0 && (
                <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">🗺️</span>
                        <h3 className="text-2xl font-bold text-emerald-400">Key Milestones</h3>
                      </div>
                      <div className="space-y-6">
                        {valueMap.key_milestones.map((milestone, idx) => {
                          // Format milestone as markdown text
                          let milestoneText = `## ${milestone.title}\n\n`;

                          if (milestone.importance) {
                            milestoneText += `*${milestone.importance}*\n\n`;
                          }

                          if (milestone.sub_topics && milestone.sub_topics.length > 0) {
                            milestoneText += `### Key Focus Areas\n\n`;
                            milestone.sub_topics.forEach(topic => {
                              milestoneText += `${topic}\n\n`;
                            });
                          }

                          if (milestone.content_types && milestone.content_types.length > 0) {
                            milestoneText += `### Recommended Content\n\n`;
                            milestone.content_types.forEach(content => {
                              milestoneText += `${content}\n\n`;
                            });
                          }

                          return (
                            <div
                              key={milestone.id || `milestone-${idx}`}
                              className="p-6 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
                            >
                              <div className="flex items-start gap-3 mb-4">
                                <span className="text-2xl flex-shrink-0 mt-1">
                                  {['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][idx] || '📌'}
                                </span>
                                <div className="flex-1">
                                  <EditableText
                                    value={milestoneText}
                                    fieldPath={`map.key_milestones[${idx}]`}
                                    className="text-[var(--text)]"
                                    multiline
                                    renderMarkdown
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transformation Summary */}
              {valueMap.transformation_summary && (() => {
                const transformationText = `## ${valueMap.transformation_summary.heading}\n\n${valueMap.transformation_summary.description}`;
                return (
                  <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">✨</span>
                        <div className="flex-1">
                          <EditableText
                            value={transformationText}
                            fieldPath="map.transformation_summary"
                            className="text-[var(--text)]"
                            multiline
                            renderMarkdown
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Content Strategy Overview */}
              {valueMap.content_strategy_overview && valueMap.content_strategy_overview.description && (() => {
                const strategyText = `## ${valueMap.content_strategy_overview.heading}\n\n${valueMap.content_strategy_overview.description}`;
                return (
                  <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">📋</span>
                        <div className="flex-1">
                          <EditableText
                            value={strategyText}
                            fieldPath="map.content_strategy_overview"
                            className="text-[var(--text)]"
                            multiline
                            renderMarkdown
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          )}

          {/* Legacy ICP Profiles Format - Fallback */}
          {!valueMap && profiles.length > 0 && (
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-emerald-500/30 backdrop-blur-sm">
              <CardContent className="pt-6">
                <p className="text-[var(--text)] text-center">
                  ⚠️ Legacy format detected. Inline editing is not available for this data structure. 
                  Please use the read-only view or regenerate the content with the latest format.
                </p>
              </CardContent>
            </Card>
          )}
    </div>
  );
}

// Read-only version without inline editing
function ContentCompassReadOnly({ data, inputs }: { data: Record<string, unknown>; inputs?: Record<string, unknown> }) {
  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  const valueMap = data.map as ClientValueMap | undefined;

  // Generate formatted text for copy and download
 const formattedText = formatContentCompassText(data);

  const renderListItems = (items: string[], color: string = 'blue') => (
    <ul className="space-y-2">
      {items.map((item: string, idx: number) => (
        <li key={idx} className="flex items-start gap-3">
          <span className={`text-${color}-400 mt-1 flex-shrink-0`}>•</span>
          <span className="text-[var(--text)] flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );

  const parseMarkdownText = (text: string): { type: 'heading' | 'paragraph' | 'list'; content: string; level?: number }[] => {
    const lines = text.split('\n');
    const result: { type: 'heading' | 'paragraph' | 'list'; content: string; level?: number }[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        result.push({ type: 'list', content: currentList.join('\n') });
        currentList = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushList();
        result.push({
          type: 'heading',
          content: headingMatch[2].replace(/\*\*/g, ''),
          level: headingMatch[1].length,
        });
        return;
      }

      const boldHeaderMatch = trimmed.match(/^\*\*([^*]+):\*\*(.*)$/);
      if (boldHeaderMatch) {
        flushList();
        result.push({
          type: 'heading',
          content: boldHeaderMatch[1],
          level: 4,
        });
        if (boldHeaderMatch[2].trim()) {
          result.push({ type: 'paragraph', content: boldHeaderMatch[2].trim() });
        }
        return;
      }

      if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        currentList.push(trimmed.substring(1).trim());
        return;
      }

      flushList();
      result.push({ type: 'paragraph', content: trimmed });
    });

    flushList();
    return result;
  };

  const renderParsedContent = (text: string, baseColor: string = 'blue') => {
    const parsed = parseMarkdownText(text);
    return (
      <div className="space-y-4">
        {parsed.map((item, idx) => {
          if (item.type === 'heading') {
            const HeadingLevel = item.level === 2 ? 'h4' : 'h5';
            const className = item.level === 2
              ? `text-base font-bold text-${baseColor}-400 uppercase tracking-wide mb-2`
              : `text-sm font-semibold text-${baseColor}-300 mb-1`;
            return <HeadingLevel key={idx} className={className}>{item.content}</HeadingLevel>;
          }
          if (item.type === 'list') {
            const items = item.content.split('\n').filter(Boolean);
            return <div key={idx}>{renderListItems(items, baseColor)}</div>;
          }
          return (
            <p key={idx} className="text-[var(--text)] leading-relaxed">
              {item.content}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
          <span className="text-4xl">🧭</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
          {header?.title || 'CONTENT COMPASS™'}
        </h1>
        {header?.subtitle && (
          <p className="text-xl font-semibold text-[var(--text)] mb-2">{header.subtitle}</p>
        )}
        {header?.tagline && (
          <p className="text-lg text-[var(--muted)] max-w-3xl mx-auto italic">{header.tagline}</p>
        )}
      </div>

      {/* Original Input Display */}
      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <CopyButton text={formattedText} label="Copy" />
        <DownloadButton content={formattedText} filename="content-compass-strategy" label="Open in Google Docs" theme={{ primary: '#10b981', secondary: '#22d3ee', title: 'Content Compass Strategy' }} />
      </div>

      {/* ClientValueMap Format - New Structure */}
      {valueMap && (
        <div className="space-y-6">
          {valueMap.current_state && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📍</span>
                    <h3 className="text-2xl font-bold text-red-400">{valueMap.current_state.heading}</h3>
                  </div>
                  {renderParsedContent(valueMap.current_state.description, 'red')}
                </div>
              </CardContent>
            </Card>
          )}

          {valueMap.desired_state && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎯</span>
                    <h3 className="text-2xl font-bold text-green-400">{valueMap.desired_state.heading}</h3>
                  </div>
                  {renderParsedContent(valueMap.desired_state.description, 'green')}
                </div>
              </CardContent>
            </Card>
          )}

          {valueMap.key_milestones && valueMap.key_milestones.length > 0 && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🗺️</span>
                    <h3 className="text-2xl font-bold text-emerald-400">Key Milestones</h3>
                  </div>
                  <div className="space-y-6">
                    {valueMap.key_milestones.map((milestone, idx) => (
                      <div
                        key={milestone.id || `milestone-${idx}`}
                        className="p-6 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-2xl flex-shrink-0 mt-1">
                            {['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][idx] || '📌'}
                          </span>
                          <h4 className="text-xl font-bold text-emerald-400">{milestone.title}</h4>
                        </div>

                        {milestone.importance && (
                          <div className="mb-4 pl-11">
                            <p className="text-[var(--muted)] italic leading-relaxed">{milestone.importance}</p>
                          </div>
                        )}

                        {milestone.sub_topics && milestone.sub_topics.length > 0 && (
                          <div className="mb-4 pl-11">
                            <h5 className="text-sm font-semibold text-teal-400 uppercase tracking-wide mb-3">
                              Key Focus Areas
                            </h5>
                            <div className="space-y-3">
                              {milestone.sub_topics.map((topic, topicIdx) => (
                                <div key={topicIdx} className="text-[var(--text)] leading-relaxed">
                                  {renderParsedContent(topic, 'teal')}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {milestone.content_types && milestone.content_types.length > 0 && (
                          <div className="pl-11">
                            <h5 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-3">
                              Recommended Content
                            </h5>
                            <div className="space-y-3">
                              {milestone.content_types.map((content, contentIdx) => (
                                <div key={contentIdx} className="text-[var(--text)] leading-relaxed">
                                  {renderParsedContent(content, 'cyan')}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {valueMap.transformation_summary && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-70/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">✨</span>
                    <h3 className="text-2xl font-bold text-purple-400">{valueMap.transformation_summary.heading}</h3>
                  </div>
                  {renderParsedContent(valueMap.transformation_summary.description, 'purple')}
                </div>
              </CardContent>
            </Card>
          )}

          {valueMap.content_strategy_overview && valueMap.content_strategy_overview.description && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📋</span>
                    <h3 className="text-2xl font-bold text-blue-400">{valueMap.content_strategy_overview.heading}</h3>
                  </div>
                  {renderParsedContent(valueMap.content_strategy_overview.description, 'blue')}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
