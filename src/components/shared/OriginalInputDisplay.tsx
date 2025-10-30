"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface InputField {
  key: string;
  label: string;
  icon: string;
}

interface OriginalInputDisplayProps {
  inputs?: Record<string, unknown>;
  defaultOpen?: boolean;
  variant?: 'collapsible' | 'simple';
}

const INPUT_FIELDS: InputField[] = [
  { key: 'product', label: 'Product', icon: '📦' },
  { key: 'targetMarket', label: 'Target Market', icon: '🎯' },
  { key: 'eventName', label: 'Event Name', icon: '🎪' },
  { key: 'eventDates', label: 'Event Dates', icon: '📅' },
  { key: 'eventLocation', label: 'Event Location', icon: '📍' },
  { key: 'ticketTiers', label: 'Ticket Tiers', icon: '🎟️' },
  { key: 'speakers', label: 'Speakers', icon: '🎤' },
  { key: 'uniqueSellingPoints', label: 'Unique Selling Points', icon: '💎' },
  { key: 'keyTransformations', label: 'Key Transformations', icon: '✨' },
  { key: 'testimonials', label: 'Testimonials', icon: '💬' },
  { key: 'leadCaptureStrategy', label: 'Lead Capture Strategy', icon: '🔗' },
];

export function OriginalInputDisplay({ 
  inputs, 
  defaultOpen = false,
  variant = 'collapsible'
}: OriginalInputDisplayProps) {
  const [showInputs, setShowInputs] = React.useState(defaultOpen);

  if (!inputs || Object.keys(inputs).length === 0) {
    return null;
  }

  const renderInputList = () => (
    <div className="space-y-0">
      {INPUT_FIELDS.map((field) => {
        const value = inputs[field.key];
        if (!value || value === '' || (typeof value === 'boolean')) return null;
        
        return (
          <div
            key={field.key}
            className="flex items-start gap-3 py-1.5 px-3 hover:bg-slate-800/30 transition-colors group/item"
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{field.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {field.label}:
              </span>
              <span className="text-sm text-[var(--text)] ml-2">
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (variant === 'simple') {
    return (
      <Card className="bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 border-slate-600/40 backdrop-blur-md shadow-2xl overflow-hidden relative group/card">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
        
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <span className="text-3xl transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3 inline-block">📋</span>
              <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover/card:bg-blue-400/30 transition-all duration-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--text)] via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Original Input
            </h3>
          </div>
          {renderInputList()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 border-slate-600/40 backdrop-blur-md shadow-2xl overflow-hidden relative group/card">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="pt-6 relative z-10">
        <button
          onClick={() => setShowInputs(!showInputs)}
          className="w-full flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 inline-block">📋</span>
              <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-blue-400/30 transition-all duration-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--text)] via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">
              Your Original Input
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--muted)] font-medium px-3 py-1.5 rounded-full bg-slate-700/50 group-hover:bg-slate-700/70 transition-colors">
              {showInputs ? 'Hide Details' : 'Show Details'}
            </span>
            <svg
              className={`w-6 h-6 text-blue-400 transition-all duration-300 ${
                showInputs ? 'rotate-180' : ''
              } group-hover:text-blue-300 group-hover:scale-110`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {showInputs && (
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            {renderInputList()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
