"use client";

import { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  followups?: string[]; // Optional field for follow-up suggestions
}

// Interface for agent response structure
interface AgentResponseItem {
  type: 'answer' | 'followups' | string;
  format: 'paragraph' | 'list' | string;
  content: string | string[];
}

// Helper function to convert markdown to HTML
function convertMarkdownToHTML(text: string): string {
  // Convert **bold** to <strong>bold</strong>
  let processedText = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* to <em>italic</em> (but avoid matching ** that's already processed)
  processedText = processedText.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');

  return processedText;
}

// Helper function to parse agent response and convert to HTML
// Returns both the HTML content and any extracted followups
function parseAgentResponse(response: string): { html: string; followups: string[] } {
  // Handle non-string inputs
  if (typeof response !== 'string') {
    console.error('parseAgentResponse received non-string:', typeof response, response);
    return { html: `<p>Error: Invalid response format</p>`, followups: [] };
  }

  // First, check if the response looks like JSON (starts with [ or {)
  const trimmed = response.trim();
  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
    // It's plain text, not JSON - convert markdown and preserve line breaks
    const withMarkdown = convertMarkdownToHTML(trimmed);
    const formatted = withMarkdown.replace(/\n/g, '<br>');
    return { html: `<p>${formatted}</p>`, followups: [] };
  }

  try {
    // Try to parse as the agent response format
    let parsedResponse: AgentResponseItem[] = [];

    // First, try to parse the response
    const parsed = JSON.parse(response);

    // Check different possible structures
    if (Array.isArray(parsed)) {
      // Check if it's the wrapper format: [{ output: "..." }]
      if (parsed[0]?.output && typeof parsed[0].output === 'string') {
        // Extract the output field and parse it again
        parsedResponse = JSON.parse(parsed[0].output);
      } else {
        // It's already the array of response items
        parsedResponse = parsed;
      }
    } else if (typeof parsed === 'object' && parsed !== null) {
      // Single object - wrap it in an array
      parsedResponse = [parsed];
    } else {
      // Not the expected format, return with markdown converted
      const withMarkdown = convertMarkdownToHTML(response);
      const formatted = withMarkdown.replace(/\n/g, '<br>');
      return { html: `<p>${formatted}</p>`, followups: [] };
    }

    // Convert each item to HTML based on type
    const htmlParts: string[] = [];
    const followupsList: string[] = [];

    parsedResponse.forEach((item) => {
      // Handle both 'answer' and 'paragraph' types for text content
      if (item.type === 'answer' || item.type === 'paragraph') {
        if (typeof item.content === 'string') {
          // Convert paragraph content - convert markdown and preserve line breaks
          const paragraphs = item.content.split('\n\n').filter(p => p.trim());
          paragraphs.forEach(p => {
            const withMarkdown = convertMarkdownToHTML(p);
            const formatted = withMarkdown.replace(/\n/g, '<br>');
            htmlParts.push(`<p class="mb-3">${formatted}</p>`);
          });
        }
      } else if (item.type === 'followups') {
        if (item.format === 'list' && Array.isArray(item.content)) {
          // Extract followups but don't add them to HTML
          followupsList.push(...item.content);
        }
      }
    });

    return { html: htmlParts.join(''), followups: followupsList };
  } catch (error) {
    // If parsing fails, return with markdown converted and line breaks preserved
    console.error('Failed to parse agent response:', error);
    const withMarkdown = convertMarkdownToHTML(response);
    const formatted = withMarkdown.replace(/\n/g, '<br>');
    return { html: `<p>${formatted}</p>`, followups: [] };
  }
}

// Helper function to sanitize HTML content
function sanitizeHTML(html: string): string {
  // Only sanitize on the client side
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'span', 'div', 'blockquote', 'code', 'pre', 'button'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'type'],
      ALLOW_DATA_ATTR: true, // Allow data-* attributes for followup buttons
    });
  }
  return html;
}

export function BrodysBrain() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hey there! I'm Brody's Brain - your AI marketing strategist. I can help you with audience insights, compelling copy, funnel optimization, and growth strategies. What's on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMinimizing, setIsMinimizing] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = textToSend;
    setInput('');
    setIsTyping(true);

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const data = await response.json();

      // Parse the response to separate main content from followups
      const { followups } = parseAgentResponse(data.response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      // If there are followups, create a separate message for them
      if (followups.length > 0) {
        const followupsMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: '', // Empty content, followups will be rendered separately
          followups: followups,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage, followupsMessage]);
      } else {
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);

      // Fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsMinimizing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsMinimizing(false);
    }, 200);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open Brody's Brain chat"
        >
          <div className="relative">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] opacity-20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] opacity-30 animate-pulse"></div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Button */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 border-2 border-white/20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300">🧠</span>
            </div>

            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:-translate-y-1">
            <div className="bg-gradient-to-r from-[var(--card)] to-[var(--bg-elev)] border border-[var(--accent)]/30 rounded-xl px-4 py-3 whitespace-nowrap shadow-2xl backdrop-blur-xl">
              <p className="text-sm font-bold text-[var(--text)] mb-1">💬 Ask Brody's Brain</p>
              <p className="text-xs text-[var(--muted)]">Your AI marketing strategist</p>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] ${isMinimizing ? 'animate-out slide-out-to-bottom-5 duration-200' : 'animate-in slide-in-from-bottom-5 duration-500'}`}>
          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-[var(--accent)]/40 bg-gradient-to-b from-[var(--card)] to-[var(--bg-elev)] backdrop-blur-2xl overflow-hidden">
            {/* Header */}
            <CardHeader className="relative bg-gradient-to-br from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] p-5 overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse animation-delay-500"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center backdrop-blur-sm border border-white/40 shadow-lg">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg font-bold mb-0.5 flex items-center gap-2">
                      Brody's Brain
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal">AI</span>
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-white/90 text-xs font-medium">Online & Ready</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:rotate-90"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0">
              <div className="h-[450px] overflow-y-auto p-5 space-y-4 scroll-smooth bg-gradient-to-b from-transparent to-[var(--bg)]/20">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50 slide-in-from-bottom-3 duration-500`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center mr-2 flex-shrink-0 shadow-lg">
                        <span className="text-sm">🧠</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] text-white rounded-tr-sm'
                          : 'bg-gradient-to-br from-[var(--bg-elev)] to-[var(--card)] text-[var(--text)] border border-[var(--border)]/50 rounded-tl-sm'
                      }`}
                    >
                      {/* Render followup buttons if this is a followup message */}
                      {message.followups && message.followups.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-[var(--muted)] mb-2">💡 Suggested follow-ups:</p>
                          {message.followups.map((followup, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                if (!isTyping) {
                                  handleSend(followup);
                                }
                              }}
                              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg px-3 py-2 text-sm hover:border-purple-500/50 hover:bg-purple-500/20 transition-all cursor-pointer"
                            >
                              {followup}
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Regular message content */
                        <div
                          className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(
                              message.role === 'assistant'
                                ? parseAgentResponse(message.content).html
                                : `<p>${message.content}</p>`
                            )
                          }}
                        />
                      )}
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <p
                          className={`text-xs ${
                            message.role === 'user' ? 'text-white/70' : 'text-[var(--muted)]'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {message.role === 'user' && (
                          <svg className="w-3 h-3 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ml-2 flex-shrink-0 shadow-lg">
                        <span className="text-sm">👤</span>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center mr-2 flex-shrink-0 shadow-lg">
                      <span className="text-sm">🧠</span>
                    </div>
                    <div className="bg-gradient-to-br from-[var(--bg-elev)] to-[var(--card)] text-[var(--text)] border border-[var(--border)]/50 rounded-2xl rounded-tl-sm px-5 py-3 shadow-lg">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2.5 h-2.5 bg-[var(--accent)] rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-[var(--accent)] rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-2.5 h-2.5 bg-[var(--accent)] rounded-full animate-bounce animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[var(--border)]/50 p-4 bg-gradient-to-t from-[var(--bg-elev)]/50 to-transparent backdrop-blur-sm">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about marketing..."
                      className="w-full bg-[var(--bg-elev)] text-[var(--text)] border-2 border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--muted)] shadow-inner"
                      disabled={isTyping}
                    />
                    {input.trim() && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="bg-gradient-to-br from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 p-0 rounded-xl hover:scale-105 active:scale-95"
                  >
                    {isTyping ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3 px-1">
                  <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Press Enter to send
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {messages.length - 1} {messages.length === 2 ? 'message' : 'messages'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}