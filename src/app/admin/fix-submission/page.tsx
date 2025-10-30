"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui-kit/Alert';

interface FixSubmissionResult {
  success?: boolean;
  updates?: string[];
  componentStatus?: Record<string, string>;
  error?: string;
  [key: string]: unknown;
}

export default function FixSubmissionPage() {
  const [submissionId, setSubmissionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FixSubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFix = async () => {
    if (!submissionId.trim()) {
      setError('Please enter a submission ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/submissions/fix-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: submissionId.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix submission');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDebug = async () => {
    if (!submissionId.trim()) {
      setError('Please enter a submission ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/submissions/debug?id=${submissionId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch submission');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Fix Webhook Submission Status</CardTitle>
            <CardDescription>
              Fix submissions that have received webhook data but show incorrect "processing" status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Submission ID
              </label>
              <Input
                type="text"
                placeholder="Enter submission ID"
                value={submissionId}
                onChange={(e) => setSubmissionId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFix()}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleFix}
                disabled={loading || !submissionId.trim()}
                className="flex-1"
              >
                {loading ? 'Processing...' : '🔧 Fix Status'}
              </Button>
              <Button
                onClick={handleDebug}
                disabled={loading || !submissionId.trim()}
                variant="outline"
                className="flex-1"
              >
                {loading ? 'Loading...' : '🔍 Debug Info'}
              </Button>
            </div>

            {error && (
              <Alert variant="error">
                <strong>Error:</strong> {error}
              </Alert>
            )}

            {result && (
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {result.success !== undefined 
                      ? (result.success ? '✅ Success' : '❌ Failed')
                      : '📊 Debug Info'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm overflow-auto max-h-96 p-4 bg-background rounded">
                    {JSON.stringify(result, null, 2)}
                  </pre>

                  {result.updates && result.updates.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Changes Made:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {result.updates.map((update: string, i: number) => (
                          <li key={i}>{update}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.componentStatus && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Component Status:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(result.componentStatus).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-background rounded">
                            <span>{key}:</span>
                            <span className={
                              value === 'completed' ? 'text-green-500 font-semibold' :
                              value === 'pending' ? 'text-orange-500 font-semibold' :
                              value === 'failed' ? 'text-red-500 font-semibold' :
                              'text-gray-500'
                            }>
                              {value as string}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">ℹ️ How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>1. Get Submission ID:</strong> Copy the submission ID from the URL when viewing results
              (e.g., <code>/results/[id]</code>)
            </p>
            <p>
              <strong>2. Debug First (Optional):</strong> Click "Debug Info" to see the current state
            </p>
            <p>
              <strong>3. Fix Status:</strong> Click "Fix Status" to automatically update componentStatus
              for any components that have data but show "pending"
            </p>
            <p className="text-orange-600">
              <strong>Note:</strong> This fix is needed for submissions created before the callback
              route was updated. New submissions should work correctly automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
