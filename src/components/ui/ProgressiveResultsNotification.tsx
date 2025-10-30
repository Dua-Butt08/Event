"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface ComponentStatus {
  [key: string]: 'pending' | 'completed' | 'failed' | 'not_requested';
}

interface ProgressiveResultsNotificationProps {
  componentStatus: ComponentStatus;
  polling?: boolean;
  immediateKeys?: string[];
}

const componentNames: Record<string, string> = {
  audienceArchitect: 'Audience Architect™',
  contentCompass: 'Content Compass™',
  messageMultiplier: 'Message Multiplier™',
  eventFunnel: 'Event Funnel',
  landingPage: 'Landing Page Strategy'
};

const componentIcons: Record<string, string> = {
  audienceArchitect: '🎯',
  contentCompass: '🧭',
  messageMultiplier: '💬',
  eventFunnel: '🌊',
  landingPage: '🚀'
};

export function ProgressiveResultsNotification({ 
  componentStatus,
  immediateKeys = []
}: ProgressiveResultsNotificationProps) {
  const [notifications, setNotifications] = useState<Array<{ key: string; name: string; icon: string }>>([]);
  const [previousStatus, setPreviousStatus] = useState<ComponentStatus>({});
  
  // CRITICAL: Persist shown notifications in sessionStorage to prevent re-showing on page revisit
  const [shownNotifications, setShownNotifications] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('shownNotifications');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });
  
  // Persist shownNotifications to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && shownNotifications.size > 0) {
      sessionStorage.setItem('shownNotifications', JSON.stringify(Array.from(shownNotifications)));
    }
  }, [shownNotifications]);

  useEffect(() => {
    // Initialize previousStatus on first render to prevent showing notifications for already-completed components
    if (Object.keys(previousStatus).length === 0 && Object.keys(componentStatus).length > 0) {
      setPreviousStatus(componentStatus);
      return;
    }
    
    // If immediate keys are provided, skip effect-based detection to avoid duplicates
    if (immediateKeys.length > 0) {
      setPreviousStatus(componentStatus);
      return;
    }
    
    // Check for newly completed components
    Object.keys(componentStatus).forEach(key => {
      const currentStatus = componentStatus[key];
      const prevStatus = previousStatus[key];
      
      // If component just became completed and we haven't shown a notification for it yet
      if (currentStatus === 'completed' && prevStatus !== 'completed' && !shownNotifications.has(key)) {
        const name = componentNames[key] || key;
        const icon = componentIcons[key] || '✅';
        
        // Add to notifications
        setNotifications(prev => {
          // Avoid duplicates
          if (prev.some(n => n.key === key)) return prev;
          return [...prev, { key, name, icon }];
        });
        
        // Mark as shown
        setShownNotifications(prev => new Set([...prev, key]));
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.key !== key));
        }, 5000);
      }
    });
    
    // Update previous status
    setPreviousStatus(componentStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentStatus, immediateKeys]);

  // Build immediate notifications from props
  const immediateList = (immediateKeys || []).map(key => ({
    key,
    name: componentNames[key] || key,
    icon: componentIcons[key] || '✅'
  }));

  // Deduplicate: immediate first, then state-based
  const seen = new Set<string>();
  const combined: Array<{ key: string; name: string; icon: string }> = [];
  immediateList.forEach(n => { if (!seen.has(n.key)) { seen.add(n.key); combined.push(n); } });
  notifications.forEach(n => { if (!seen.has(n.key)) { seen.add(n.key); combined.push(n); } });

  if (combined.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-24 right-6 z-50 space-y-3 max-w-sm">
      {combined.map(({ key, name, icon }) => (
        <Card 
          key={key}
          className="bg-[var(--card)]/95 backdrop-blur-xl border-green-500/50 shadow-2xl animate-slide-in-right"
        >
          <div className="p-4 flex items-start space-x-3">
            <div className="flex-shrink-0 text-3xl animate-subtle-scale">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-400 mb-1">
                ✨ Ready to Explore!
              </p>
              <p className="text-base font-bold text-[var(--text)]">
                {name}
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">
                Click the card below to view your results
              </p>
            </div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.key !== key))}
              className="flex-shrink-0 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              ✕
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
