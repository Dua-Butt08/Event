"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSubmissionsQuery } from '@/store/api/submissionsApi';

// Component configurations for overview
const COMPONENTS = [
  { key: 'audienceArchitect', name: 'Audience Architect™', icon: '🎯' },
  { key: 'contentCompass', name: 'Content Compass™', icon: '🧭' },
  { key: 'messageMultiplier', name: 'Message Multiplier™', icon: '💬' },
  { key: 'eventFunnel', name: 'Event Funnel', icon: '🌊' },
  { key: 'landingPage', name: 'Landing Page', icon: '🚀' },
];

export function StrategyOverview() {
  const { data: submissionsData } = useGetSubmissionsQuery({ limit: 50 });
  const submissions = submissionsData?.submissions || [];
  
  // Get the latest submission regardless of status
  const getLatestSubmission = () => {
    const sortedSubmissions = [...submissions]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    return sortedSubmissions[0] || null;
  };
  
  const latestSubmission = getLatestSubmission();
  
  // Extract component status map
  const componentStatus = (latestSubmission?.components as { componentStatus?: Record<string, string> })?.componentStatus || {};
  
  // Count completed components
  const completedComponents = COMPONENTS.filter(c => componentStatus[c.key] === 'completed').length;
  
  // Overall status
  const overallStatus = latestSubmission?.status || 'pending';

  return (
    <div className="mb-12">
      <Card className="bg-[var(--card)]/80 backdrop-blur-xl border-[var(--border)]/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <span>📊</span>
            <span>Strategy Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {latestSubmission ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-elev)]/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                  {completedComponents}
                </div>
                <div className="text-sm text-[var(--muted)] font-medium">Components Ready</div>
              </div>
              <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-elev)]/50">
                <div className="text-3xl font-bold text-blue-500">🎯</div>
                <div className="text-sm text-[var(--muted)] font-medium">Personalized</div>
              </div>
              <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-elev)]/50">
                <div className="text-3xl font-bold text-purple-500">🚀</div>
                <div className="text-sm text-[var(--muted)] font-medium">Ready to Deploy</div>
              </div>
              <div className="space-y-3 p-4 rounded-xl bg-[var(--bg-elev)]/50">
                <div className="text-3xl font-bold text-green-500">
                  {overallStatus === 'completed' ? '✓' : '⏳'}
                </div>
                <div className="text-sm text-[var(--muted)] font-medium">
                  {overallStatus === 'completed' ? 'Complete' : 'In Progress'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--muted)]">
                Create your first strategy to see your overview here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}