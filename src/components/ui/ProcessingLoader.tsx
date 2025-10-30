"use client";

import { useState, useEffect, useMemo } from 'react';
import { LoadingSpinner } from './loading-spinner';

interface ProcessingLoaderProps {
  stage?: 'analyzing' | 'generating' | 'finalizing';
  className?: string;
  customMessages?: string[];
  customTitle?: string;
  customIcon?: string;
}

export function ProcessingLoader({ stage = 'analyzing', className, customMessages, customTitle, customIcon }: ProcessingLoaderProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Memoize messages object to prevent dependency changes
  const messages = useMemo(() => ({
    analyzing: [
      "Analyzing your target market",
      "Understanding your audience needs",
      "Processing market insights",
      "Identifying key demographics",
      "Mapping customer journey",
    ],
    generating: [
      "Crafting your Audience Architect™",
      "Building your Content Compass™",
      "Creating your Message Multiplier™",
      "Designing your Event Funnel",
      "Generating your Landing Page",
      "Optimizing strategy components",
    ],
    finalizing: [
      "Polishing your strategy",
      "Finalizing components",
      "Preparing results",
      "Almost ready",
    ]
  }), []);

  const icons = useMemo(() => ({
    analyzing: '🔍',
    generating: '✨',
    finalizing: '🎯'
  }), []);

  useEffect(() => {
    const activeMessages = customMessages || messages[stage];
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % activeMessages.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 3;
        return newProgress > 92 ? 92 : newProgress;
      });
    }, 800);

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [stage, messages, customMessages]);

  return (
    <div className={`flex flex-col items-center justify-center space-y-10 ${className || ''}`}>
      {/* Premium animated logo/icon */}
      <div className="relative">
        {/* Outer glow rings - Subtle and professional */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] opacity-10 animate-smooth-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent-2)] to-[var(--accent)] opacity-5 animate-gentle-breathe"></div>
        
        {/* Main container with glass-morphism */}
        <div className="relative bg-[var(--card)]/80 backdrop-blur-xl rounded-3xl p-12 border border-[var(--border)]/50 shadow-2xl">
          {/* Rotating border effect - Slowed down and subtle */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] opacity-20 blur-xl animate-spin" style={{ animationDuration: '8s' }}></div>
          
          {/* Inner content */}
          <div className="relative flex flex-col items-center space-y-4">
            <div className="text-6xl animate-gentle-breathe">
              {customIcon || icons[stage]}
            </div>
            <LoadingSpinner size="xl" className="text-[var(--accent)]" />
          </div>
        </div>
      </div>

      {/* Status and progress section */}
      <div className="w-full max-w-xl space-y-6">
        {/* Stage indicator */}
        <div className="flex items-center justify-center space-x-3">
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-[var(--accent)]/30 backdrop-blur-sm">
            <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
              {stage === 'analyzing' && '🔍 Analyzing'}
              {stage === 'generating' && '✨ Generating'}
              {stage === 'finalizing' && '🎯 Finalizing'}
            </span>
          </div>
        </div>

        {/* Main title */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-1" style={{ lineHeight: '1.3' }}>
            {customTitle || 'Creating Your Marketing Strategy'}
          </h2>
          <p className="text-base text-[var(--muted)] min-h-[24px] font-medium">
            {(customMessages || messages[stage])[currentMessage]}{dots}
          </p>
        </div>

        {/* Progress bar with percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-[var(--muted)]">
            <span>Progress</span>
            <span className="font-semibold text-[var(--accent)]">{Math.round(progress)}%</span>
          </div>
          <div className="relative w-full bg-[var(--bg-elev)] rounded-full h-3 overflow-hidden border border-[var(--border)]/30">
            <div 
              className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Time estimate with icon */}
        <div className="flex items-center justify-center space-x-2 text-sm text-[var(--muted)] bg-[var(--bg-elev)]/50 px-4 py-3 rounded-xl border border-[var(--border)]/30">
          <span>⏱️</span>
          <span>Average completion time: <span className="font-semibold text-[var(--text)]">2 minutes</span></span>
        </div>
      </div>

      {/* Processing steps visualization - Minimal and subtle */}
      <div className="flex items-center justify-center space-x-3">
        {[
          { emoji: '💡', label: 'Analyze' },
          { emoji: '✨', label: 'Generate' },
          { emoji: '🎯', label: 'Refine' }
        ].map((step, index) => {
          const isActive = index <= Math.floor(progress / 33);
          const isCurrent = index === Math.floor(progress / 33);
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all duration-700 ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-lg shadow-[var(--accent)]/20'
                    : 'bg-[var(--bg-elev)]/50 text-[var(--muted)] border border-[var(--border)]/30'
                } ${
                  isCurrent ? 'animate-gentle-breathe' : ''
                }`}
              >
                {step.emoji}
              </div>
              <span className={`text-xs font-medium transition-colors duration-500 ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Reassurance message - Removed for minimal design */}
    </div>
  );
}

interface SuccessAnimationProps {
  onComplete?: () => void;
}

export function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setScale(1), 100);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="flex flex-col items-center justify-center space-y-8 transition-all duration-500"
      style={{ transform: `scale(${scale})` }}
    >
      {/* Success icon with subtle animation layers */}
      <div className="relative">
        {/* Outer subtle rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-10 animate-smooth-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 opacity-5 animate-gentle-breathe"></div>
        
        {/* Main container */}
        <div className="relative bg-[var(--card)]/90 backdrop-blur-xl rounded-3xl p-12 border-2 border-green-400/50 shadow-2xl shadow-green-500/20">
          {/* Checkmark with subtle animation */}
          <div className="text-7xl animate-subtle-scale">
            ✅
          </div>
        </div>
      </div>
      
      {/* Success message */}
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent pb-1" style={{ lineHeight: '1.2' }}>
          Strategy Complete! 🎉
        </h2>
        <p className="text-lg text-[var(--muted)] leading-relaxed">
          Your comprehensive marketing strategy is ready to explore
        </p>
        
        {/* Success stats - Subtle indicator animations */}
        <div className="flex items-center justify-center space-x-6 pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-gentle-fade"></div>
            <span className="text-sm text-[var(--muted)]">5 Components</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-gentle-fade" style={{ animationDelay: '0.3s' }}></div>
            <span className="text-sm text-[var(--muted)]">AI Powered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-gentle-fade" style={{ animationDelay: '0.6s' }}></div>
            <span className="text-sm text-[var(--muted)]">Personalized</span>
          </div>
        </div>
      </div>
    </div>
  );
}