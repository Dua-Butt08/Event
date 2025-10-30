"use client";

import React, { useState, useCallback, useRef } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OriginalInputDisplay } from '@/components/shared/OriginalInputDisplay';
import { formatAudienceArchitectText } from '@/lib/format-utils';

interface AudienceArchitectDisplayProps {
  data: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  onUpdate?: (updatedData: Record<string, unknown>) => Promise<void>;
  isUpdating?: boolean;
}

interface Section {
  id: string;
  heading: string;
  fields?: Record<string, unknown>;
  content?: string;
  items?: Record<string, unknown>[];
  quotes?: (string | { type: string; quote: string })[];
  bullets?: string[];
  external_blame?: string[];
  internal_truth?: string[];
  core_message_themes?: string[];
  language_to_use?: string[];
  language_to_avoid?: string[];
  emotional_bridges?: string[];
  belief_shifts?: string[];
  resonance_points?: string[];
  name?: string;
  age?: number;
  description?: string;
}

export function AudienceArchitectDisplay({ data, inputs, onUpdate, isUpdating = false }: AudienceArchitectDisplayProps) {
  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  const sections = (data.sections as Section[]) || [];
  const [editingField, setEditingField] = useState<string | null>(null);
  const editValueRef = useRef<string>(''); // Use ref instead of state to prevent re-renders
  const [localData, setLocalData] = useState(data);

  // Generate formatted text for copy and download using local data
  const formattedText = formatAudienceArchitectText(localData);

  // Start editing a field
  const startEdit = useCallback((fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath);
    editValueRef.current = currentValue;
  }, []);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingField(null);
    editValueRef.current = '';
  }, []);

  // Save edited value
  const saveEdit = useCallback(async () => {
    if (!editingField) return;

    const pathParts = editingField.split(/[\.\[\]]+/).filter(Boolean);
    const updatedData = JSON.parse(JSON.stringify(localData));
    
    // Navigate to the nested property and update it
    let current: Record<string, unknown> | unknown[] = updatedData;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!isNaN(Number(part))) {
        current = (current as unknown[])[parseInt(part)] as Record<string, unknown> | unknown[];
      } else {
        current = (current as Record<string, unknown>)[part] as Record<string, unknown> | unknown[];
      }
    }
    
    const finalKey = pathParts[pathParts.length - 1];
    if (!isNaN(Number(finalKey))) {
      (current as unknown[])[parseInt(finalKey)] = editValueRef.current;
    } else {
      (current as Record<string, unknown>)[finalKey] = editValueRef.current;
    }

    setLocalData(updatedData);
    
    if (onUpdate) {
      try {
        await onUpdate(updatedData);
      } catch (error) {
        console.error('Failed to save edit:', error);
        // Revert on error
        setLocalData(data);
      }
    }
    
    cancelEdit();
  }, [editingField, localData, onUpdate, data, cancelEdit]);

  // Editable text component - memoized to prevent recreation on each render
  const EditableText = useCallback(({ 
    value, 
    fieldPath, 
    className = '', 
    multiline = false
  }: { 
    value: string; 
    fieldPath: string; 
    className?: string; 
    multiline?: boolean;
  }) => {
    const isEditing = editingField === fieldPath;
    
    if (isEditing) {
      return (
        <div className="space-y-2 my-2" key={fieldPath}>
          {multiline ? (
            <textarea
              key={`${fieldPath}-textarea`}
              defaultValue={editValueRef.current}
              onChange={(e) => {
                editValueRef.current = e.target.value;
              }}
              className="w-full p-3 rounded-lg bg-slate-800/90 border-2 border-blue-400 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') cancelEdit();
              }}
            />
          ) : (
            <input
              key={`${fieldPath}-input`}
              type="text"
              defaultValue={editValueRef.current}
              onChange={(e) => {
                editValueRef.current = e.target.value;
              }}
              className="w-full p-2 rounded-lg bg-slate-800/90 border-2 border-blue-400 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
            />
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={saveEdit}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isUpdating ? 'Saving...' : '✓ Save'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={cancelEdit}
              disabled={isUpdating}
            >
              ✕ Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <span
        className={`${className} cursor-pointer hover:bg-blue-500/20 hover:outline-2 hover:outline-blue-400/60 rounded-md px-2 py-1 -mx-2 -my-1 transition-all duration-200 group inline-block`}
        onClick={() => startEdit(fieldPath, value)}
        title="Click to edit"
      >
        {value}
        <span className="opacity-0 group-hover:opacity-100 ml-2 text-blue-400 text-sm transition-opacity">✏️</span>
      </span>
    );
  }, [editingField, isUpdating, startEdit, saveEdit, cancelEdit]);

  // Render section content with inline editing
  const renderSectionContent = (section: Section, sectionIndex: number) => {
    // Get the current section data from localData
    const localSections = (localData.sections as Section[]) || [];
    const currentSection = localSections[sectionIndex] || section;

    // Primary persona section (main N8N format)
    if (section.id === 'primary_persona' && currentSection.items && currentSection.items.length > 0) {
      const personaData = currentSection.items[0] as Record<string, string | undefined>;
      const itemIndex = 0;
      
      return (
        <div className="space-y-6">
          {/* Demographics */}
          {currentSection.fields && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-cyan-400">Demographics</h3>
              {Object.entries(currentSection.fields).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <EditableText 
                    value={String(value)} 
                    fieldPath={`sections[${sectionIndex}].fields.${key}`}
                    className="text-[var(--text)] mt-1"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Quick Facts */}
          {currentSection.bullets && currentSection.bullets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Quick Facts</h3>
              <ul className="space-y-2">
                {currentSection.bullets.map((bullet: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <EditableText 
                      value={bullet} 
                      fieldPath={`sections[${sectionIndex}].bullets[${idx}]`}
                      className="text-[var(--text)] flex-1"
                      multiline
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emotional Triggers & Fears */}
          <div className="grid md:grid-cols-2 gap-6">
            {personaData.emotion && personaData.trigger && (
              <div className="p-5 rounded-lg bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Emotional Triggers</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-orange-400 uppercase tracking-wide block mb-1">Primary Emotion</span>
                    <EditableText 
                      value={personaData.emotion} 
                      fieldPath={`sections[${sectionIndex}].items[${itemIndex}].emotion`}
                      className="text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-orange-400 uppercase tracking-wide block mb-1">Trigger</span>
                    <EditableText 
                      value={personaData.trigger} 
                      fieldPath={`sections[${sectionIndex}].items[${itemIndex}].trigger`}
                      className="text-[var(--text)]"
                      multiline
                    />
                  </div>
                  {personaData.impact && (
                    <div>
                      <span className="text-sm font-semibold text-orange-400 uppercase tracking-wide block mb-1">Impact</span>
                      <EditableText 
                        value={personaData.impact} 
                        fieldPath={`sections[${sectionIndex}].items[${itemIndex}].impact`}
                        className="text-[var(--text)]"
                        multiline
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {personaData.fear && personaData.why_it_terrifies && (
              <div className="p-5 rounded-lg bg-gradient-to-br from-red-500/5 to-pink-500/5 border border-red-500/20">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Core Fears</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-red-400 uppercase tracking-wide block mb-1">Primary Fear</span>
                    <EditableText 
                      value={personaData.fear} 
                      fieldPath={`sections[${sectionIndex}].items[${itemIndex}].fear`}
                      className="text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-red-400 uppercase tracking-wide block mb-1">Why It Terrifies</span>
                    <EditableText 
                      value={personaData.why_it_terrifies} 
                      fieldPath={`sections[${sectionIndex}].items[${itemIndex}].why_it_terrifies`}
                      className="text-[var(--text)]"
                      multiline
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Customer Quote */}
          {personaData.quote && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">In Their Own Words</h3>
              <p className="text-[var(--text)] italic text-lg leading-relaxed">
                &ldquo;<EditableText 
                  value={personaData.quote} 
                  fieldPath={`sections[${sectionIndex}].items[${itemIndex}].quote`}
                  className="text-[var(--text)]"
                  multiline
                />&rdquo;
              </p>
            </div>
          )}

          {/* Past Solutions */}
          {(personaData.solution || personaData.why_it_failed) && (
            <div className="p-5 rounded-lg bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">Previous Solutions Attempted</h3>
              <div className="space-y-3">
                {personaData.solution && (
                  <div>
                    <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wide block mb-1">What They Tried</span>
                    <EditableText 
                      value={personaData.solution} 
                      fieldPath={`sections[${sectionIndex}].items[${itemIndex}].solution`}
                      className="text-[var(--text)]"
                    />
                  </div>
                )}
                {personaData.why_they_tried_it && (
                  <div>
                    <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wide block mb-1">Why They Tried It</span>
                    <EditableText 
                      value={personaData.why_they_tried_it} 
                      fieldPath={`sections[${sectionIndex}].items[${itemIndex}].why_they_tried_it`}
                      className="text-[var(--text)]"
                      multiline
                    />
                  </div>
                )}
                {personaData.why_it_failed && (
                  <div>
                    <span className="text-sm font-semibold text-red-400 uppercase tracking-wide block mb-1">Why It Failed</span>
                    <EditableText 
                      value={personaData.why_it_failed} 
                      fieldPath={`sections[${sectionIndex}].items[${itemIndex}].why_it_failed`}
                      className="text-[var(--text)]"
                      multiline
                    />
                  </div>
                )}
                {personaData.how_failure_felt && (
                  <div>
                    <span className="text-sm font-semibold text-red-400 uppercase tracking-wide block mb-1">How Failure Felt</span>
                    <EditableText 
                      value={personaData.how_failure_felt} 
                      fieldPath={`sections[${sectionIndex}].items[${itemIndex}].how_failure_felt`}
                      className="text-[var(--text)]"
                      multiline
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Deep Psychology */}
          <div className="grid md:grid-cols-2 gap-6">
            {(personaData.deeper_reason || personaData.why_it_matters) && (
              <div className="p-5 rounded-lg bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Deep Motivations</h3>
                <div className="space-y-3">
                  {personaData.deeper_reason && (
                    <div>
                      <span className="text-sm font-semibold text-purple-400 uppercase tracking-wide block mb-1">Deeper Reason</span>
                      <EditableText 
                        value={personaData.deeper_reason} 
                        fieldPath={`sections[${sectionIndex}].items[${itemIndex}].deeper_reason`}
                        className="text-[var(--text)]"
                        multiline
                      />
                    </div>
                  )}
                  {personaData.why_it_matters && (
                    <div>
                      <span className="text-sm font-semibold text-purple-400 uppercase tracking-wide block mb-1">Why It Matters</span>
                      <EditableText 
                        value={personaData.why_it_matters} 
                        fieldPath={`sections[${sectionIndex}].items[${itemIndex}].why_it_matters`}
                        className="text-[var(--text)]"
                        multiline
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {(personaData.internal_effect || personaData.self_belief_it_feeds) && (
              <div className="p-5 rounded-lg bg-gradient-to-br from-pink-500/5 to-red-500/5 border border-pink-500/20">
                <h3 className="text-lg font-semibold text-pink-400 mb-3">Internal Impact</h3>
                <div className="space-y-3">
                  {personaData.internal_effect && (
                    <div>
                      <span className="text-sm font-semibold text-pink-400 uppercase tracking-wide block mb-1">Internal Effect</span>
                      <EditableText 
                        value={personaData.internal_effect} 
                        fieldPath={`sections[${sectionIndex}].items[${itemIndex}].internal_effect`}
                        className="text-[var(--text)]"
                        multiline
                      />
                    </div>
                  )}
                  {personaData.self_belief_it_feeds && (
                    <div>
                      <span className="text-sm font-semibold text-pink-400 uppercase tracking-wide block mb-1">Limiting Belief</span>
                      &ldquo;<EditableText 
                        value={personaData.self_belief_it_feeds} 
                        fieldPath={`sections[${sectionIndex}].items[${itemIndex}].self_belief_it_feeds`}
                        className="text-[var(--text)]"
                      />&rdquo;
                    </div>
                  )}
                  {personaData.refuse_to && (
                    <div>
                      <span className="text-sm font-semibold text-pink-400 uppercase tracking-wide block mb-1">Refuses To</span>
                      <EditableText 
                        value={personaData.refuse_to} 
                        fieldPath={`sections[${sectionIndex}].items[${itemIndex}].refuse_to`}
                        className="text-[var(--text)]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* External Blame vs Internal Truth */}
          {(currentSection.external_blame || currentSection.internal_truth) && (
            <div className="grid md:grid-cols-2 gap-6">
              {currentSection.external_blame && currentSection.external_blame.length > 0 && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
                  <h4 className="text-sm font-bold text-red-400 uppercase mb-3">External Blame</h4>
                  <ul className="space-y-2">
                    {currentSection.external_blame.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <EditableText 
                          value={item} 
                          fieldPath={`sections[${sectionIndex}].external_blame[${idx}]`}
                          className="text-[var(--text)] flex-1"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {currentSection.internal_truth && currentSection.internal_truth.length > 0 && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
                  <h4 className="text-sm font-bold text-green-400 uppercase mb-3">Internal Truth</h4>
                  <ul className="space-y-2">
                    {currentSection.internal_truth.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <EditableText 
                          value={item} 
                          fieldPath={`sections[${sectionIndex}].internal_truth[${idx}]`}
                          className="text-[var(--text)] flex-1"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Message Blueprint */}
          {(currentSection.core_message_themes || currentSection.language_to_use || currentSection.language_to_avoid || 
            currentSection.emotional_bridges || currentSection.belief_shifts || currentSection.resonance_points) && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-cyan-400">Message Blueprint</h3>
              
              {currentSection.core_message_themes && currentSection.core_message_themes.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-blue-400 uppercase mb-3">Core Message Themes</h4>
                  <ul className="space-y-2">
                    {currentSection.core_message_themes.map((theme: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <EditableText 
                          value={theme} 
                          fieldPath={`sections[${sectionIndex}].core_message_themes[${idx}]`}
                          className="text-[var(--text)] flex-1"
                          multiline
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                {currentSection.language_to_use && currentSection.language_to_use.length > 0 && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20">
                    <h4 className="text-sm font-bold text-green-400 uppercase mb-3">Language to Use</h4>
                    <ul className="space-y-2">
                      {currentSection.language_to_use.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <EditableText 
                            value={item} 
                            fieldPath={`sections[${sectionIndex}].language_to_use[${idx}]`}
                            className="text-[var(--text)] flex-1"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {currentSection.language_to_avoid && currentSection.language_to_avoid.length > 0 && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
                    <h4 className="text-sm font-bold text-red-400 uppercase mb-3">Language to Avoid</h4>
                    <ul className="space-y-2">
                      {currentSection.language_to_avoid.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-400">✗</span>
                          <EditableText 
                            value={item} 
                            fieldPath={`sections[${sectionIndex}].language_to_avoid[${idx}]`}
                            className="text-[var(--text)] flex-1"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {currentSection.emotional_bridges && currentSection.emotional_bridges.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-purple-400 uppercase mb-3">Emotional Bridges</h4>
                  <ul className="space-y-2">
                    {currentSection.emotional_bridges.map((bridge: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-400">→</span>
                        <EditableText 
                          value={bridge} 
                          fieldPath={`sections[${sectionIndex}].emotional_bridges[${idx}]`}
                          className="text-[var(--text)] flex-1"
                          multiline
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {currentSection.belief_shifts && currentSection.belief_shifts.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-cyan-400 uppercase mb-3">Belief Shifts</h4>
                  <ul className="space-y-2">
                    {currentSection.belief_shifts.map((shift: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400">↗</span>
                        <EditableText 
                          value={shift} 
                          fieldPath={`sections[${sectionIndex}].belief_shifts[${idx}]`}
                          className="text-[var(--text)] flex-1"
                          multiline
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {currentSection.resonance_points && currentSection.resonance_points.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-pink-400 uppercase mb-3">Resonance Points</h4>
                  <ul className="space-y-2">
                    {currentSection.resonance_points.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-pink-400">♦</span>
                        <EditableText 
                          value={point} 
                          fieldPath={`sections[${sectionIndex}].resonance_points[${idx}]`}
                          className="text-[var(--text)] flex-1"
                          multiline
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Relationship Impact */}
          {personaData.relationship && (
            <div className="p-5 rounded-lg bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Relationship Impact</h3>
              <EditableText 
                value={personaData.relationship} 
                fieldPath={`sections[${sectionIndex}].items[${itemIndex}].relationship`}
                className="text-[var(--text)]"
                multiline
              />
            </div>
          )}
        </div>
      );
    }
    
    // Handle all other section types with inline editing
    // Demographics Profile, simple content, items array, etc.
    // (Using same logic as original but with EditableText)
    
    if (currentSection.fields && Object.keys(currentSection.fields).length > 0) {
      return (
        <div className="space-y-3">
          {Object.entries(currentSection.fields).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
                {key.replace(/_/g, ' ')}
              </span>
              <EditableText 
                value={String(value)} 
                fieldPath={`sections[${sectionIndex}].fields.${key}`}
                className="text-[var(--text)] mt-1"
              />
            </div>
          ))}
        </div>
      );
    }

    if (currentSection.content && !currentSection.items) {
      return (
        <EditableText 
          value={currentSection.content} 
          fieldPath={`sections[${sectionIndex}].content`}
          className="text-[var(--text)] leading-relaxed whitespace-pre-line"
          multiline
        />
      );
    }

    // Handle items array (list of strings or objects)
    if (currentSection.items && Array.isArray(currentSection.items)) {
      const items = currentSection.items as unknown[];
      
      // If items are strings, render as list
      if (items.length > 0 && typeof items[0] === 'string') {
        return (
          <ul className="space-y-3">
            {items.map((item, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <EditableText 
                  value={String(item)} 
                  fieldPath={`sections[${sectionIndex}].items[${idx}]`}
                  className="text-[var(--text)] flex-1"
                  multiline
                />
              </li>
            ))}
          </ul>
        );
      }
      
      // If items are objects with simple key-value pairs, render as cards
      if (items.length > 0 && typeof items[0] === 'object') {
        return (
          <div className="space-y-4">
            {items.map((item, idx: number) => (
              <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20">
                {Object.entries(item as Record<string, unknown>).map(([key, value]) => (
                  <div key={key} className="mb-3 last:mb-0">
                    <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide block mb-1">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <EditableText 
                      value={String(value)} 
                      fieldPath={`sections[${sectionIndex}].items[${idx}].${key}`}
                      className="text-[var(--text)]"
                      multiline={String(value).length > 80}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }
    }

    // Fallback to original rendering for other cases
    return <p className="text-[var(--text)]">Content type not yet supported for inline editing</p>;
  };

  return (
    <div className="space-y-8 w-full min-h-screen pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 mb-4">
          <span className="text-4xl">🎯</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
          Audience Architect™
        </h1>
        <p className="text-xl font-semibold text-[var(--text)] mb-2">
          {header?.subtitle || "Understanding Your Ideal Customer's Pain Points"}
        </p>
        <p className="text-lg text-[var(--muted)] max-w-3xl mx-auto italic">
          {header?.tagline || 'Transform frustration into connection'}
        </p>
      </div>



      {/* Original Input Display */}
      <OriginalInputDisplay inputs={inputs} defaultOpen={false} variant="collapsible" />

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <CopyButton text={formattedText} label="Copy" />
        <DownloadButton 
          content={formattedText} 
          filename="audience-architect-profile" 
          label="Open in Google Docs" 
          theme={{ primary: '#3b82f6', secondary: '#06b6d4', title: 'Audience Architect Profile' }} 
        />
      </div>

      {/* Sections */}
      {sections.length === 0 && (
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <p className="text-red-400 text-center">
              ⚠️ No sections found in the data.
            </p>
          </CardContent>
        </Card>
      )}
      {sections.map((section, sectionIndex) => (
        <Card
          key={section.id}
          className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm"
        >
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              {section.heading}
            </h2>
            {renderSectionContent(section, sectionIndex)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
