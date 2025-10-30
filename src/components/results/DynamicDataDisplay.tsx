"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DynamicDataDisplayProps {
  data: unknown;
  depth?: number;
}

/**
 * Dynamically renders any data structure with proper formatting
 * Handles strings, arrays, objects, and nested structures
 */
export function DynamicDataDisplay({ data, depth = 0 }: DynamicDataDisplayProps) {
  if (!data) return null;

  // Handle string values
  if (typeof data === 'string') {
    const cleanedContent = cleanContent(data);
    return (
      <div className="text-[var(--text)] leading-relaxed whitespace-pre-line">
        {cleanedContent.split('\n').map((line, idx) => {
          // If line looks like a heading (all caps or starts with number), make it bold
          if (line.match(/^[A-Z\s]+:$/) || line.match(/^\d+\./)) {
            return (
              <p key={idx} className="font-semibold text-blue-400 mt-4 mb-2">
                {line}
              </p>
            );
          }
          return line ? <p key={idx} className="mb-2">{line}</p> : <br key={idx} />;
        })}
      </div>
    );
  }

  // Handle number or boolean
  if (typeof data === 'number' || typeof data === 'boolean') {
    return <p className="text-[var(--text)]">{String(data)}</p>;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    if (data.length === 0) return null;

    // Check if array contains strings
    if (typeof data[0] === 'string') {
      return (
        <div className="space-y-2">
          {data.map((item: string, index: number) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-[var(--bg-elev)] border border-[var(--border)]/30"
            >
              <p className="text-[var(--text)] leading-relaxed">{cleanContent(item)}</p>
            </div>
          ))}
        </div>
      );
    }

    // Array contains objects
    return (
      <div className="space-y-4">
        {data.map((item: unknown, index: number) => (
          <div
            key={index}
            className="p-5 rounded-lg bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20"
          >
            <DynamicDataDisplay data={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  // Handle objects
  if (typeof data === 'object') {
    const entries = Object.entries(data);
    if (entries.length === 0) return null;

    return (
      <div className={depth > 0 ? 'space-y-3' : 'space-y-4'}>
        {entries.map(([key, value]: [string, unknown]) => {
          if (!value) return null;

          // Format the key for display using the new formatting function
          const displayKey = formatSectionTitle(key);

          return (
            <div key={key} className={depth > 0 ? '' : 'mb-4'}>
              <h4 className={`font-semibold mb-2 ${
                depth === 0 
                  ? 'text-blue-400 text-base' 
                  : 'text-[var(--text)] text-sm'
              }`}>
                {displayKey}:
              </h4>
              <DynamicDataDisplay data={value} depth={depth + 1} />
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

/**
 * Format key for professional display
 * Converts underscores and camelCase to Title Case
 * Removes special characters
 */
export function formatSectionTitle(key: string): string {
  // Special case: if this is a "header" key, replace with "Goals"
  const lowerKey = key.toLowerCase();
  if (lowerKey === 'header' || lowerKey === 'output_header' || lowerKey === 'funnel' || lowerKey === 'framework') {
    return 'Goals';
  }

  return key
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Add space before capital letters (camelCase)
    .replace(/([A-Z])/g, ' $1')
    // Remove special characters like *, #, --, etc.
    .replace(/[*#\-]/g, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim()
    // Convert to Title Case
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Clean content by removing unnecessary symbols
 */
export function cleanContent(content: string): string {
  if (typeof content !== 'string') return content;
  
  return content
    // Remove markdown headers at the start of lines (##, ###, etc.)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove leading dashes and asterisks
    .replace(/^[\s]*[-*]+[\s]*/gm, '')
    // Remove triple dashes (---)
    .replace(/^---+$/gm, '')
    // Clean up excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Get section icon based on key content
 */
export function getSectionIcon(key: string): string {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('goal') || lowerKey.includes('header')) return '🎯';
  if (lowerKey.includes('demographic') || lowerKey.includes('profile')) return '👤';
  if (lowerKey.includes('problem') || lowerKey.includes('core')) return '⚠️';
  if (lowerKey.includes('emotion') || lowerKey.includes('trigger')) return '💥';
  if (lowerKey.includes('fear')) return '😰';
  if (lowerKey.includes('relationship') && lowerKey.includes('impact')) return '👥';
  if (lowerKey.includes('comment')) return '💬';
  if (lowerKey.includes('solution') || lowerKey.includes('failed')) return '🔄';
  if (lowerKey.includes('resistance') || lowerKey.includes('don\'t want')) return '🚫';
  if (lowerKey.includes('transformation') || lowerKey.includes('dream')) return '✨';
  if (lowerKey.includes('post') || lowerKey.includes('soundbite')) return '🎉';
  if (lowerKey.includes('belief') || lowerKey.includes('market')) return '💭';
  if (lowerKey.includes('psychological') || lowerKey.includes('barrier')) return '🧠';
  if (lowerKey.includes('blame') || lowerKey.includes('truth')) return '🔍';
  if (lowerKey.includes('message') || lowerKey.includes('blueprint')) return '📝';
  if (lowerKey.includes('landing') || lowerKey.includes('page')) return '🚀';
  if (lowerKey.includes('content') || lowerKey.includes('compass')) return '🧭';
  if (lowerKey.includes('multiplier')) return '💬';
  if (lowerKey.includes('step') || lowerKey.includes('section')) return '📋';
  if (lowerKey.includes('faq')) return '❓';
  if (lowerKey.includes('cta')) return '🚀';
  return '📌';
}

/**
 * Get section color based on key content
 */
export function getSectionColor(key: string): string {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('header')) return 'from-blue-500/10 to-cyan-500/10 border-blue-500/20';
  if (lowerKey.includes('problem') || lowerKey.includes('core')) return 'from-red-500/10 to-orange-500/10 border-red-500/20';
  if (lowerKey.includes('transformation') || lowerKey.includes('dream')) return 'from-green-500/10 to-emerald-500/10 border-green-500/20';
  if (lowerKey.includes('message') || lowerKey.includes('blueprint')) return 'from-blue-500/10 to-purple-500/10 border-blue-500/20';
  return 'bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50';
}

/**
 * Get section order for sorting
 */
export function getSectionOrder(key: string): number {
  if (key.toLowerCase().includes('header')) return 0;
  const match = key.match(/^(\d+)\./);
  if (match && match[1]) return parseInt(match[1], 10);
  return 99; // Unknown sections go to the end
}

/**
 * Wrapper component that automatically renders all sections from data
 */
export function DynamicSectionRenderer({ data, componentName }: { data: unknown; componentName: string }) {
  // Get all top-level sections dynamically
  const sections = React.useMemo(() => {
    if (!data || typeof data !== 'object') return [];

    return Object.entries(data)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => ({
        key,
        title: formatSectionTitle(key),
        value,
        order: getSectionOrder(key),
        icon: getSectionIcon(key),
        colorClass: getSectionColor(key)
      }))
      .sort((a, b) => a.order - b.order);
  }, [data]);

  if (sections.length === 0) {
    return (
      <Card className="bg-[var(--card)]/80">
        <CardContent className="pt-6">
          <p className="text-[var(--muted)] text-center">
            No {componentName} data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {sections.map(({ key: sectionKey, title, value, icon, colorClass }) => (
        <Card key={sectionKey} className={`bg-gradient-to-br ${colorClass}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicDataDisplay data={value} depth={0} />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
