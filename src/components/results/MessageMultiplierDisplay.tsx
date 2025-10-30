"use client";

import React from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Card, CardContent } from '@/components/ui/card';
import { OriginalInputDisplay } from '@/components/shared/OriginalInputDisplay';
import { formatMessageMultiplierText } from '@/lib/format-utils';
import { InlineEditableContent, SaveToolbar } from '@/components/shared/InlineEditableContent';

interface MessageMultiplierDisplayProps {
  data: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  onUpdate?: (updatedData: Record<string, unknown>) => Promise<void>;
  isUpdating?: boolean;
  submissionId?: string;
}

interface Milestone {
  title: string;
  theme: string;
  order?: number;
  id?: string;
}

interface Persona {
  name: string;
  notes?: string;
  [key: string]: unknown;
}

interface SubTopic {
  title: string;
  content: string;
  [key: string]: unknown;
}

export function MessageMultiplierDisplay({ 
  data, 
  inputs, 
  onUpdate, 
  isUpdating = false 
}: MessageMultiplierDisplayProps) {
  if (!onUpdate) {
    // Read-only mode
    return <MessageMultiplierReadOnly data={data} inputs={inputs} />;
  }

 return (
    <InlineEditableContent data={data} onUpdate={onUpdate} isUpdating={isUpdating}>
      {({ localData, EditableText, hasChanges, saveAll, cancelAll }) => (
        <MessageMultiplierEditable
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

function MessageMultiplierEditable({
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
   EditableText: React.ComponentType<{
    value: string;
    fieldPath: string;
    className?: string;
    multiline?: boolean;
    renderMarkdown?: boolean;
  }>;
  hasChanges: boolean;
  saveAll: () => Promise<void>;
  cancelAll: () => void;
  isUpdating?: boolean;
}) {
  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  
  // Extract milestone and persona information
  const milestone = data.milestone as Milestone | undefined;
  const milestones = data.milestones as Milestone[] | undefined;
  const persona = data.persona as Persona | undefined;
  
  // Extract subtopics (both new and legacy formats)
  const subTopics = data.sub_topics as SubTopic[] | string[] | undefined;
  const legacyTopics = data.topics as string[] | undefined;
  
  // Determine if this is the new structure (milestone/persona) or legacy structure (topics)
  const isNewStructure = !!milestone || !!persona || !!data.version;
  const hasSubTopics = Array.isArray(subTopics) && subTopics.length > 0;
  const hasLegacyTopics = Array.isArray(legacyTopics) && legacyTopics.length > 0;

  // Generate formatted text for copy and download
  const formattedText = formatMessageMultiplierText(data);

 return (
    <div className="space-y-8 w-full min-h-screen pb-20">
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-50 to-pink-600 mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          {header?.title || 'Message Multiplier™'}
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
        <DownloadButton 
          content={formattedText} 
          filename="message-multiplier-content" 
          label="Open in Google Docs" 
          theme={{ primary: '#8b5cf6', secondary: '#ec4899', title: 'Message Multiplier Content' }} 
        />
      </div>

      {/* Content Display - New Structure (Milestone/Persona) */}
      {isNewStructure && (
        <div className="space-y-6">
          {/* Single Milestone Display */}
          {milestone && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🎯</span>
                    <h2 className="text-2xl font-bold text-purple-400">Milestone</h2>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-[var(--text)]">
                      <EditableText
                        value={milestone.title}
                        fieldPath="milestone.title"
                        className="text-[var(--text)]"
                      />
                    </h3>
                    {milestone.theme && (
                      <p className="text-[var(--muted)] italic">
                        <EditableText
                          value={milestone.theme}
                          fieldPath="milestone.theme"
                          className="text-[var(--muted)] italic"
                          multiline
                        />
                      </p>
                    )}
                    {milestone.order && (
                      <p className="text-sm text-purple-400">
                        Order: {milestone.order}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Multiple Milestones Display */}
          {milestones && milestones.length > 0 && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🗺️</span>
                    <h2 className="text-2xl font-bold text-purple-400">Milestones</h2>
                  </div>
                  <div className="space-y-6">
                    {milestones.map((milestone, idx) => (
                      <div
                        key={milestone.id || `milestone-${idx}`}
                        className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-50/30"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-2xl flex-shrink-0 mt-1">
                            {['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][idx] || '📌'}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-purple-400 mb-2">
                              <EditableText
                                value={milestone.title}
                                fieldPath={`milestones[${idx}].title`}
                                className="text-purple-400"
                              />
                            </h3>
                            {milestone.theme && (
                              <p className="text-[var(--muted)] italic mb-2">
                                <EditableText
                                  value={milestone.theme}
                                  fieldPath={`milestones[${idx}].theme`}
                                  className="text-[var(--muted)] italic"
                                  multiline
                                />
                              </p>
                            )}
                            {milestone.order && (
                              <p className="text-sm text-purple-400">
                                Order: {milestone.order}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Persona Display */}
          {persona && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">👤</span>
                    <h2 className="text-2xl font-bold text-pink-400">Persona</h2>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-[var(--text)]">
                      <EditableText
                        value={persona.name}
                        fieldPath="persona.name"
                        className="text-[var(--text)]"
                      />
                    </h3>
                    {persona.notes && (
                      <div className="text-[var(--text)] leading-relaxed">
                        <EditableText
                          value={persona.notes}
                          fieldPath="persona.notes"
                          className="text-[var(--text)]"
                          multiline
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subtopics Display */}
          {hasSubTopics && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">📝</span>
                    <h2 className="text-2xl font-bold text-blue-400">Subtopics</h2>
                  </div>
                  <div className="space-y-6">
                    {Array.isArray(subTopics) && subTopics.map((subTopic, idx) => {
                      if (typeof subTopic === 'string') {
                        // Handle string array format
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
                          >
                            <EditableText
                              value={subTopic}
                              fieldPath={`sub_topics[${idx}]`}
                              className="text-[var(--text)] leading-relaxed"
                              multiline
                            />
                          </div>
                        );
                      } else if (typeof subTopic === 'object' && subTopic !== null) {
                        // Handle object array format
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-50/10 border-blue-50/30"
                          >
                            <h4 className="text-lg font-semibold text-blue-400 mb-2">
                              <EditableText
                                value={(subTopic as SubTopic).title || `Subtopic ${idx + 1}`}
                                fieldPath={`sub_topics[${idx}].title`}
                                className="text-blue-400"
                              />
                            </h4>
                            <div className="text-[var(--text)] leading-relaxed">
                              <EditableText
                                value={(subTopic as SubTopic).content || ''}
                                fieldPath={`sub_topics[${idx}].content`}
                                className="text-[var(--text)]"
                                multiline
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback for empty subtopics but valid structure */}
          {(!hasSubTopics || !Array.isArray(subTopics)) && (
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-green-400">
                    ✅ Content structure is valid with milestone and/or persona information.
                  </p>
                  <p className="text-[var(--muted)] mt-2">
                    No additional subtopics provided in this section.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Legacy Content Display - Fallback */}
      {!isNewStructure && hasLegacyTopics && (
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Content Topics</h2>
              <div className="space-y-3">
                {legacyTopics.map((topic, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-50/10 border-blue-50/30">
                    <EditableText
                      value={topic}
                      fieldPath={`topics[${idx}]`}
                      className="text-[var(--text)] leading-relaxed"
                      multiline
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Content Warning */}
      {!isNewStructure && !hasLegacyTopics && (
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-400">
                ⚠️ No content found in the data structure.
              </p>
              <p className="text-[var(--muted)] mt-2">
                The message multiplier data may need to be regenerated or the format may not be supported.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Read-only version without inline editing
function MessageMultiplierReadOnly({ data, inputs }: { data: Record<string, unknown>; inputs?: Record<string, unknown> }) {
  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  
 // Extract milestone and persona information
  const milestone = data.milestone as Milestone | undefined;
  const milestones = data.milestones as Milestone[] | undefined;
  const persona = data.persona as Persona | undefined;
  
  // Extract subtopics (both new and legacy formats)
  const subTopics = data.sub_topics as SubTopic[] | string[] | undefined;
  const legacyTopics = data.topics as string[] | undefined;
  
  // Determine if this is the new structure (milestone/persona) or legacy structure (topics)
  const isNewStructure = !!milestone || !!persona || !!data.version;
  const hasSubTopics = Array.isArray(subTopics) && subTopics.length > 0;
  const hasLegacyTopics = Array.isArray(legacyTopics) && legacyTopics.length > 0;

  // Generate formatted text for copy and download
  const formattedText = formatMessageMultiplierText(data);

  return (
    <div className="space-y-8 w-full min-h-screen pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-40 bg-clip-text text-transparent mb-3">
          {header?.title || 'Message Multiplier™'}
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
        <DownloadButton 
          content={formattedText} 
          filename="message-multiplier-content" 
          label="Open in Google Docs" 
          theme={{ primary: '#8b5cf6', secondary: '#ec4899', title: 'Message Multiplier Content' }} 
        />
      </div>

      {/* Content Display - New Structure (Milestone/Persona) */}
      {isNewStructure && (
        <div className="space-y-6">
          {/* Single Milestone Display */}
          {milestone && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🎯</span>
                    <h2 className="text-2xl font-bold text-purple-400">Milestone</h2>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-[var(--text)]">{milestone.title}</h3>
                    {milestone.theme && (
                      <p className="text-[var(--muted)] italic">{milestone.theme}</p>
                    )}
                    {milestone.order && (
                      <p className="text-sm text-purple-400">
                        Order: {milestone.order}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Multiple Milestones Display */}
          {milestones && milestones.length > 0 && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-70/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🗺️</span>
                    <h2 className="text-2xl font-bold text-purple-400">Milestones</h2>
                  </div>
                  <div className="space-y-6">
                    {milestones.map((milestone, idx) => (
                      <div
                        key={milestone.id || `milestone-${idx}`}
                        className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-2xl flex-shrink-0 mt-1">
                            {['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][idx] || '📌'}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-purple-400 mb-2">{milestone.title}</h3>
                            {milestone.theme && (
                              <p className="text-[var(--muted)] italic mb-2">{milestone.theme}</p>
                            )}
                            {milestone.order && (
                              <p className="text-sm text-purple-400">
                                Order: {milestone.order}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Persona Display */}
          {persona && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">👤</span>
                    <h2 className="text-2xl font-bold text-pink-400">Persona</h2>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-[var(--text)]">{persona.name}</h3>
                    {persona.notes && (
                      <div className="text-[var(--text)] leading-relaxed">
                        {persona.notes}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subtopics Display */}
          {hasSubTopics && (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">📝</span>
                    <h2 className="text-2xl font-bold text-blue-40">Subtopics</h2>
                  </div>
                  <div className="space-y-6">
                    {Array.isArray(subTopics) && subTopics.map((subTopic, idx) => {
                      if (typeof subTopic === 'string') {
                        // Handle string array format
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
                          >
                            <p className="text-[var(--text)] leading-relaxed">{subTopic}</p>
                          </div>
                        );
                      } else if (typeof subTopic === 'object' && subTopic !== null) {
                        // Handle object array format
                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-50/30"
                          >
                            <h4 className="text-lg font-semibold text-blue-400 mb-2">
                              {(subTopic as SubTopic).title || `Subtopic ${idx + 1}`}
                            </h4>
                            <p className="text-[var(--text)] leading-relaxed">
                              {(subTopic as SubTopic).content || ''}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback for empty subtopics but valid structure */}
          {(!hasSubTopics || !Array.isArray(subTopics)) && (
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-green-400">
                    ✅ Content structure is valid with milestone and/or persona information.
                  </p>
                  <p className="text-[var(--muted)] mt-2">
                    No additional subtopics provided in this section.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Legacy Content Display - Fallback */}
      {!isNewStructure && hasLegacyTopics && (
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-blue-40 mb-4">Content Topics</h2>
              <div className="space-y-3">
                {legacyTopics.map((topic, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
                    <p className="text-[var(--text)] leading-relaxed">{topic}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Content Warning */}
      {!isNewStructure && !hasLegacyTopics && (
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-400">
                ⚠️ No content found in the data structure.
              </p>
              <p className="text-[var(--muted)] mt-2">
                The message multiplier data may need to be regenerated or the format may not be supported.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
