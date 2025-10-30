import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { DownloadButton } from '@/components/ui/DownloadButton';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { FormSubmissionData } from '@/lib/storage';
import { useDispatch } from 'react-redux';
import { submissionsApi, useUpdateSubmissionContentMutation, useGetSubmissionByIdQuery } from '@/store/api/submissionsApi';
import { OriginalInputDisplay } from '@/components/shared/OriginalInputDisplay';

interface ResultsDisplayProps {
  submission: FormSubmissionData;
}

function getComponentContent(submission: FormSubmissionData): string | undefined {
  if (!submission.components) return undefined;
  
  // Map form kinds to component keys
  const componentMap: Record<string, string> = {
    'icp': 'audienceArchitect',
    'valueMap': 'contentCompass',
    'contentExpander': 'messageMultiplier',
    'funnel': 'eventFunnel',
    'landing': 'landingPage'
  };
  
  const componentKey = componentMap[submission.kind];
  if (!componentKey || !submission.components[componentKey]) return undefined;
  
  const component = submission.components[componentKey];
  
  // If it's already a string, return it
  if (typeof component === 'string') {
    return component;
  }
  
  // If it's an object, stringify it
  if (typeof component === 'object' && component !== null) {
    return JSON.stringify(component, null, 2);
  }
  
  return undefined;
}

export function ResultsDisplay({ submission }: ResultsDisplayProps) {
  const dispatch = useDispatch();
  const [showRawData, setShowRawData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState<string>('');
  const [updateSubmissionContent, { isLoading: isSaving }] = useUpdateSubmissionContentMutation();
  
  // Use RTK Query to get real-time updates for the submission
 const { data: updatedSubmission } = useGetSubmissionByIdQuery(submission.id, {
    pollingInterval: submission.status === 'pending' || 
                    (submission.components?.componentStatus && 
                     Object.values(submission.components.componentStatus).some(status => status === 'pending')) 
                     ? 3000 : 0, // Poll every 3 seconds if any component is pending (faster polling)
    refetchOnFocus: true,
    refetchOnReconnect: true,
    // Refetch when the component mounts and periodically while pending
    refetchOnMountOrArgChange: true,
  });

  // Use the updated submission data if available, otherwise fall back to initial submission
  const currentSubmission = updatedSubmission || submission;

  // Effect to handle status changes and component updates
  useEffect(() => {
    if (currentSubmission?.status === 'completed' || 
        (currentSubmission?.components?.componentStatus && 
         !Object.values(currentSubmission.components.componentStatus).some(status => status === 'pending'))) {
      // Stop polling when all components are completed
      dispatch(submissionsApi.util.invalidateTags([{ type: 'Submission', id: submission.id }]));
    }
  }, [currentSubmission?.status, currentSubmission?.components?.componentStatus, dispatch, submission.id]);

  if (!currentSubmission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-4">Results Not Found</h1>
          <p className="text-[var(--muted)] mb-6">The submission you're looking for doesn't exist.</p>
          <Link href="/audience-architect">
            <Button>Return to Audience Architect™</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if we have generated content (either in output or in components)
  const isGeneratedContent = (currentSubmission.output && currentSubmission.output.length > 0) || 
                            (currentSubmission.components && Object.keys(currentSubmission.components).length > 0);
  const formTypeLabel = getFormTypeLabel(currentSubmission.kind);
  
  // Get available components
  const availableComponents = currentSubmission.components ? Object.keys(currentSubmission.components).filter(key => 
    currentSubmission.components && currentSubmission.components[key] !== null && currentSubmission.components[key] !== undefined
  ) : [];
  const statusMap = (currentSubmission.components as { componentStatus?: Record<string, 'pending' | 'completed' | 'failed' | 'not_requested'> })?.componentStatus;
  
  // Get content to display
  const getContentToDisplay = () => {
    // Show the main output or the appropriate component
    return currentSubmission.output || getComponentContent(currentSubmission) || 'No content available';
  };

  // Get the title based on the submission kind
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      'icp': 'Audience Architect™',
      'valueMap': 'Content Compass™',
      'contentExpander': 'Message Multiplier™',
      'funnel': 'Event Funnel',
      'landing': 'Landing Page'
    };
    return titles[currentSubmission.kind] || formTypeLabel;
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[var(--accent)]/10 to-transparent py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-[var(--accent)]/30 mb-6">
            <span className="text-sm font-medium text-[var(--accent)]">
              {currentSubmission.status === 'completed' ? '✅ Strategy Complete' : '⏳ Generating...'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
            Your {getPageTitle()} Strategy
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto mb-8">
            {getFormTypeDescription(currentSubmission.kind)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-sm text-[var(--muted)]">
              Generated on {new Date(currentSubmission.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>
            <div className="hidden sm:block text-[var(--muted)]">•</div>
            <div className="text-sm text-[var(--muted)] font-mono">
              ID: {currentSubmission.id.slice(-8)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Component Selection - only show if we're on the main results page */}
        {availableComponents.length > 0 && submission.kind === 'icp' && (
          <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50 mb-8">
            <CardHeader>
              <CardTitle className="group text-xl font-bold text-[var(--text)] flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="legend-icon inline-block transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-105 group-hover:-translate-y-0.5"
                >
                  📋
                </span>
                View Other Components
              </CardTitle>
              <p className="text-[var(--muted)]">
                Explore other parts of your marketing strategy
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Link href={`/results/content-compass?id=${submission.id}`}>
                  <Button variant="outline">
                    Content Compass™ {statusMap?.contentCompass === 'completed' ? '✓ Ready' : 'Pending'}
                  </Button>
                </Link>
                <Link href={`/results/message-multiplier?id=${submission.id}`}>
                  <Button variant="outline">
                    Message Multiplier™ {statusMap?.messageMultiplier === 'completed' ? '✓ Ready' : 'Pending'}
                  </Button>
                </Link>
                <Link href={`/results/funnel?id=${submission.id}`}>
                  <Button variant="outline">
                    Event Funnel {statusMap?.eventFunnel === 'completed' ? '✓ Ready' : 'Pending'}
                  </Button>
                </Link>
                {statusMap?.landingPage === 'completed' ? (
                  <Link href={`/results/landing?id=${submission.id}`}>
                    <Button variant="outline">
                      Landing Page ✓ Ready
                    </Button>
                  </Link>
                ) : statusMap?.landingPage === 'pending' ? (
                  <Button variant="outline" disabled>
                    Landing Page ⏳ Generating
                  </Button>
                ) : (statusMap?.landingPage === 'not_requested' || !statusMap?.landingPage) && statusMap?.eventFunnel === 'completed' ? (
                  <Link href={`/event-funnel?submissionId=${submission.id}`}>
                    <Button variant="outline">
                      Landing Page → Generate
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/results/${submission.id}`}>
                    <Button variant="outline">
                      Landing Page (Requires Event Funnel)
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Generated Strategy */}
          {isGeneratedContent ? (
            <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="group text-3xl font-bold text-[var(--text)] mb-4 flex items-center justify-center gap-3">
                  <span
                    aria-hidden="true"
                    className="legend-icon text-4xl inline-block transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-105 group-hover:-translate-y-0.5"
                  >
                    🎯
                  </span>
                  {getPageTitle()}
                </CardTitle>
                <p className="text-[var(--muted)] text-lg">
                  AI-generated marketing strategy tailored to your specific needs
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  {!isEditing && (
                    <>
                      <CopyButton 
                        text={getContentToDisplay()} 
                        className="bg-[var(--accent)] hover:bg-[var(--accent)]/90"
                      />
                      <DownloadButton 
                        content={getContentToDisplay()}
                        filename={`${getPageTitle().toLowerCase().replace(/\s+/g, '-').replace(/™/g, '')}-${submission.id.slice(-8)}`}
                        className="bg-[var(--accent-2)] hover:bg-[var(--accent-2)]/90"
                        label="Open in Google Docs"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditedText(getContentToDisplay());
                          setIsEditing(true);
                        }}
                      >
                        ✏️ Edit
                      </Button>
                    </>
                  )}
                  {isEditing && (
                    <div className="flex gap-3">
                      <Button 
                        onClick={async () => {
                          try {
                            await updateSubmissionContent({
                              id: currentSubmission.id,
                              output: editedText,
                            }).unwrap();
                            setIsEditing(false);
                            dispatch(submissionsApi.util.invalidateTags([{ type: 'Submission', id: currentSubmission.id }]));
                          } catch {
                            alert('Failed to save changes. Please try again.');
                          }
                        }}
                        className="bg-[var(--accent)] hover:bg-[var(--accent)]/90"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="prose prose-lg prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold text-[var(--text)] mb-6 mt-8 first:mt-0 border-b border-[var(--border)] pb-3">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-8 text-[var(--accent)]">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-semibold text-[var(--text)] mb-3 mt-6">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-lg font-semibold text-[var(--text)] mb-2 mt-4">{children}</h4>,
                      p: ({ children }) => <p className="text-[var(--text)] mb-4 leading-relaxed text-lg">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside text-[var(--text)] mb-6 space-y-2 ml-4">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside text-[var(--text)] mb-6 space-y-2 ml-4">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      blockquote: ({ children }) => (<blockquote className="border-l-4 border-[var(--accent)] pl-6 my-6 italic text-[var(--muted)]">{children}</blockquote>),
                      code: ({ children }) => (<code className="bg-[var(--bg-elev)] px-2 py-1 rounded text-sm font-mono border border-[var(--border)]">{children}</code>),
                      pre: ({ children }) => (<pre className="bg-[var(--bg-elev)] p-4 rounded-lg border border-[var(--border)] overflow-x-auto">{children}</pre>),
                      table: ({ children }) => (<div className="overflow-x-auto my-6"><table className="w-full border-collapse border border-[var(--border)] rounded-lg">{children}</table></div>),
                      th: ({ children }) => (<th className="border border-[var(--border)] px-4 py-3 bg-[var(--accent)]/10 font-semibold text-left">{children}</th>),
                      td: ({ children }) => (<td className="border border-[var(--border)] px-4 py-3">{children}</td>),
                      strong: ({ children }) => <strong className="font-bold text-[var(--accent)]">{children}</strong>,
                      em: ({ children }) => <em className="italic text-[var(--accent-2)]">{children}</em>
                    }}>
                      {formatOutput(getContentToDisplay())}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full h-96 p-4 rounded-lg bg-[var(--bg-elev)] border border-[var(--border)] text-[var(--text)] font-mono text-sm"
                      placeholder="Edit content here (Markdown)"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50">
              <CardContent className="text-center py-16">
                <div className="text-6xl mb-6">⏳</div>
                <h3 className="text-2xl font-bold text-[var(--text)] mb-4">Strategy Being Generated</h3>
                <p className="text-[var(--muted)] mb-4 max-w-md mx-auto">
                  Your {getPageTitle()} strategy is being created. This usually takes 1-2 minutes.
                </p>
                <p className="text-sm font-medium text-[var(--accent)] mb-6 animate-pulse">
                  Please wait while our AI processes your information...
                </p>
                <p className="text-sm text-[var(--muted)] mb-6">Status: {currentSubmission.status}</p>
                <Button 
                  onClick={() => dispatch(submissionsApi.util.invalidateTags([{ type: 'Submission', id: currentSubmission.id }]))}
                  className="bg-[var(--accent)] hover:bg-[var(--accent)]/90"
                >
                  Refresh Page
                </Button>

              </CardContent>
            </Card>
          )}

          {/* Marketing Optimization Tips */}
          <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)]/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[var(--text)] flex items-center gap-3">
                <span className="text-2xl">💡</span>
                How to Optimize Your Marketing Funnel
              </CardTitle>
              <p className="text-[var(--muted)]">
                Actionable insights to improve your marketing strategy based on your results
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-elev)] rounded-lg">
                  <h3 className="group font-semibold text-[var(--accent)] mb-2">
                    <span
                      aria-hidden="true"
                      className="legend-icon inline-block mr-2 transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-105 group-hover:-translate-y-0.5"
                    >
                      🎯
                    </span>
                    Target Audience Clarity
                  </h3>
                  <p className="text-[var(--text)] text-sm">
                    {currentSubmission.kind === 'icp' 
                      ? 'Use your Ideal Customer Profile to create more targeted messaging that resonates with your audience\'s specific pain points and desires.' 
                      : 'Understanding your ideal customer\'s demographics, problems, and fears helps you create more targeted messaging that resonates.'}
                  </p>
                </div>
                <div className="p-4 bg-[var(--bg-elev)] rounded-lg">
                  <h3 className="group font-semibold text-[var(--accent)] mb-2">
                    <span
                      aria-hidden="true"
                      className="legend-icon inline-block mr-2 transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-105 group-hover:-translate-y-0.5"
                    >
                      💡
                    </span>
                    Pain Point Identification
                  </h3>
                  <p className="text-[var(--text)] text-sm">
                    {currentSubmission.kind === 'icp' 
                      ? 'Recognize the core problems and emotional triggers to position your solution as the answer they\'ve been looking for.' 
                      : 'Identifying core problems and emotional triggers allows you to position your solution as the answer they\'ve been looking for.'}
                  </p>
                </div>
                <div className="p-4 bg-[var(--bg-elev)] rounded-lg">
                  <h3 className="group font-semibold text-[var(--accent)] mb-2">
                    <span
                      aria-hidden="true"
                      className="legend-icon inline-block mr-2 transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-105 group-hover:-translate-y-0.5"
                    >
                      🔄
                    </span>
                    Transformation Path
                  </h3>
                  <p className="text-[var(--text)] text-sm">
                    {currentSubmission.kind === 'valueMap' 
                      ? 'Map the journey from current state to desired outcome to craft compelling value propositions and success stories.' 
                      : 'Mapping the journey from current state to desired outcome helps you craft compelling value propositions and success stories.'}
                  </p>
                </div>
                <div className="p-4 bg-[var(--bg-elev)] rounded-lg">
                  <h3 className="group font-semibold text-[var(--accent)] mb-2">
                    <span
                      aria-hidden="true"
                      className="legend-icon inline-block mr-2 transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-105 group-hover:-translate-y-0.5"
                    >
                      📈
                    </span>
                    Content Distribution
                  </h3>
                  <p className="text-[var(--text)] text-sm">
                    {currentSubmission.kind === 'contentExpander' 
                      ? 'Use your expanded content ideas to create a consistent publishing schedule that addresses every aspect of your audience\'s journey.' 
                      : 'Create a consistent publishing schedule that addresses every aspect of your audience\'s journey with targeted content.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inputs Section - Reusable Component */}
          <OriginalInputDisplay inputs={currentSubmission.inputs as Record<string, unknown>} defaultOpen={false} variant="collapsible" />

          {/* Action Buttons */}
          <div className="mt-12 text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/audience-architect">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <span className="mr-2">🔄</span>
                  Create New Strategy
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
                  <span className="mr-2">✨</span>
                  Explore Other Tools
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-[var(--muted)]">
                💾 Save this page or bookmark the URL to access your results later
              </p>
              
              {/* Technical Details Toggle */}
              <div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowRawData(!showRawData)}
                  className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showRawData ? 'Hide' : 'Show'} Technical Details
                </Button>
                
                {showRawData && (
                  <Card className="mt-4 bg-[var(--bg-elev)] border-[var(--border)]">
                    <CardHeader>
                      <CardTitle className="text-sm">Raw Submission Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs overflow-auto max-h-96">
                        {JSON.stringify(currentSubmission, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 );
}

function getFormTypeLabel(formType: string): string {
  const labels = {
    icp: 'Ideal Customer Profile',
    valueMap: 'Value Mapping',
    contentExpander: 'Content Expansion',
    funnel: 'Event Funnel',
    landing: 'Landing Page'
  };
  return labels[formType as keyof typeof labels] || 'Marketing';
}

function getFormTypeDescription(formType: string): string {
  const descriptions = {
    icp: 'A comprehensive profile of your ideal customer to focus your marketing efforts and improve conversions.',
    valueMap: 'A strategic roadmap showing the transformation journey from current state to desired outcome.',
    contentExpander: 'Content ideas and strategies to engage your audience at every stage of their journey.',
    funnel: 'A complete event funnel strategy to attract, engage and convert high-ticket clients.',
    landing: 'A high-converting landing page structure designed to capture leads and drive sales.'
  };
  return descriptions[formType as keyof typeof descriptions] || 'AI-generated marketing strategy tailored to your business needs.';
}

function formatOutput(output: string | undefined): string {
  if (!output) return 'No content available';
  
  // Try to parse JSON output and format it nicely
 try {
    const parsed = JSON.parse(output);
    return formatJsonAsMarkdown(parsed);
  } catch {
    // If not JSON, return as-is
    return output;
  }
}

/**
 * Clean and format markdown content
 */
function cleanMarkdownSymbols(text: string): string {
  if (typeof text !== 'string') return text;
  
  return text
    // Remove triple dashes
    .replace(/^---+$/gm, '')
    // Remove excessive asterisks (but keep single * for lists)
    .replace(/\*\*/g, '')
    // Clean up excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Format title with proper capitalization and remove underscores
 */
function formatTitle(key: string): string {
  // Skip header-like keys
  const lowerKey = key.toLowerCase();
  if (lowerKey === 'header' || lowerKey === 'output_header' || lowerKey === 'funnel' || lowerKey === 'framework') {
    return 'Goals';
  }

  return key
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Add space before capital letters
    .replace(/([A-Z])/g, ' $1')
    .trim()
    // Convert to Title Case
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatJsonAsMarkdown(obj: Record<string, unknown>, level = 1): string {
  let markdown = '';
  
  for (const [key, value] of Object.entries(obj)) {
    // Use the new formatting function
    let title = formatTitle(key);
    
    // Add icons for common sections
    if (title.toLowerCase().includes('demographics')) title = '🎯 ' + title;
    else if (title.toLowerCase().includes('core problem')) title = '⚠️ ' + title;
    else if (title.toLowerCase().includes('emotional trigger')) title = '💥 ' + title;
    else if (title.toLowerCase().includes('fear')) title = '😨 ' + title;
    else if (title.toLowerCase().includes('impact on relationship')) title = '👥 ' + title;
    else if (title.toLowerCase().includes('comment')) title = '💬 ' + title;
    else if (title.toLowerCase().includes('solution')) title = '🔍 ' + title;
    else if (title.toLowerCase().includes('don\'t want')) title = '🚫 ' + title;
    else if (title.toLowerCase().includes('transformation')) title = '✨ ' + title;
    else if (title.toLowerCase().includes('soundbite')) title = '📢 ' + title;
    else if (title.toLowerCase().includes('market')) title = '📊 ' + title;
    else if (title.toLowerCase().includes('psychological')) title = '🧠 ' + title;
    else if (title.toLowerCase().includes('blame')) title = '🔍 ' + title;
    else if (title.toLowerCase().includes('current state')) title = '📍 ' + title;
    else if (title.toLowerCase().includes('desired state')) title = '🎯 ' + title;
    else if (title.toLowerCase().includes('milestone')) title = '🛣️ ' + title;
    else if (title.toLowerCase().includes('hero')) title = '🎯 ' + title;
    else if (title.toLowerCase().includes('overview')) title = '📋 ' + title;
    else if (title.toLowerCase().includes('audience')) title = '👥 ' + title;
    else if (title.toLowerCase().includes('speaker')) title = '🎤 ' + title;
    else if (title.toLowerCase().includes('schedule')) title = '📅 ' + title;
    else if (title.toLowerCase().includes('venue')) title = '🏢 ' + title;
    else if (title.toLowerCase().includes('ticketing')) title = '🎫 ' + title;
    else if (title.toLowerCase().includes('social proof') || title.toLowerCase().includes('testimonial')) title = '⭐ ' + title;
    else if (title.toLowerCase().includes('faq')) title = '❓ ' + title;
    else if (title.toLowerCase().includes('lead capture')) title = '📧 ' + title;
    else if (title.toLowerCase().includes('cta')) title = '🚀 ' + title;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      markdown += `${'#'.repeat(Math.min(level, 6))} ${title}\n\n`;
      markdown += formatJsonAsMarkdown(value as Record<string, unknown>, level + 1);
    } else if (Array.isArray(value)) {
      markdown += `${'#'.repeat(Math.min(level, 6))} ${title}\n\n`;
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          // Clean the string content before adding
          const cleanedItem = cleanMarkdownSymbols(item);
          markdown += `${index + 1}. ${cleanedItem}\n\n`;
        } else if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, unknown>;
          // Get the title from the object if it exists
          const itemTitle = (itemObj.title as string) || (itemObj.name as string) || `Item ${index + 1}`;
          markdown += `**${index + 1}. ${itemTitle}**\n\n`;
          
          // Process the sub-object properties
          for (const [subKey, subValue] of Object.entries(itemObj)) {
            if (subKey !== 'title' && subKey !== 'name') {
              // Format sub-key for readability - apply same formatting
              const formattedSubKey = formatTitle(subKey);
              
              // Handle nested objects in arrays
              if (typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue)) {
                markdown += `**${formattedSubKey}:**\n\n`;
                markdown += formatJsonAsMarkdown(subValue as Record<string, unknown>, level + 2);
              } else {
                // Format the value for better readability
                let formattedValue: string;
                if (Array.isArray(subValue)) {
                  formattedValue = (subValue as unknown[]).join(', ');
                } else if (typeof subValue === 'string') {
                  formattedValue = cleanMarkdownSymbols(subValue);
                } else {
                  formattedValue = String(subValue);
                }
                markdown += `**${formattedSubKey}:** ${formattedValue}\n\n`;
              }
            }
          }
        }
      });
      markdown += '\n';
    } else {
      // Format the value for better readability and clean symbols
      let formattedValue: string;
      if (typeof value === 'string') {
        formattedValue = cleanMarkdownSymbols(value);
      } else {
        formattedValue = String(value);
      }
      markdown += `**${title}:** ${formattedValue}\n\n`;
    }
  }
  
  return markdown;
}
