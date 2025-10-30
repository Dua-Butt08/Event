"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FuturisticBackground } from '@/components/visuals/FuturisticBackground';
import { PricingContactForm } from '@/components/pricing/PricingContactForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function ContactContent() {
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') || '';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FuturisticBackground scrollY={0} />
      
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 text-[var(--accent)] border border-[var(--accent)]/30 px-6 py-3 text-lg rounded-full inline-block backdrop-blur-sm">
              📞 Let's Talk About Your Marketing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.2' }}>
              {selectedPlan ? `Get Started with ${selectedPlan}` : 'Contact Our Sales Team'}
            </h1>
            <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
              {selectedPlan 
                ? `Let's set up your ${selectedPlan} plan and discuss how we can help achieve your marketing goals.`
                : 'Tell us about your marketing challenges and we\'ll create a customized solution that delivers results.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <PricingContactForm selectedPlan={selectedPlan} />
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-2)]/10 rounded-2xl p-6 backdrop-blur-sm border border-[var(--accent)]/20">
                <h3 className="text-xl font-bold text-[var(--text)] mb-4">Why Choose Our Platform?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 text-lg">✓</span>
                    <div>
                      <div className="font-semibold text-[var(--text)]">300% Average ROI</div>
                      <div className="text-sm text-[var(--muted)]">Proven results across 500+ businesses</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 text-lg">🚀</span>
                    <div>
                      <div className="font-semibold text-[var(--text)]">5-Minute Setup</div>
                      <div className="text-sm text-[var(--muted)]">Start generating strategies immediately</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400 text-lg">🧠</span>
                    <div>
                      <div className="font-semibold text-[var(--text)]">Advanced AI Models</div>
                      <div className="text-sm text-[var(--muted)]">GPT-4, Claude, and custom-trained models</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-lg">🛡️</span>
                    <div>
                      <div className="font-semibold text-[var(--text)]">14-Day Guarantee</div>
                      <div className="text-sm text-[var(--muted)]">Risk-free trial with money-back guarantee</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[var(--card)]/50 to-[var(--card)]/50 rounded-2xl p-6 backdrop-blur-sm border border-[var(--border)]/20">
                <h3 className="text-xl font-bold text-[var(--text)] mb-4">Response Times</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--muted)]">Email Response</span>
                    <span className="text-[var(--accent)] font-semibold">&lt; 4 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--muted)]">Demo Scheduling</span>
                    <span className="text-[var(--accent)] font-semibold">Same day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--muted)]">Account Setup</span>
                    <span className="text-[var(--accent)] font-semibold">&lt; 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-6 backdrop-blur-sm border border-green-500/20">
                <h3 className="text-xl font-bold text-green-400 mb-4">What Happens Next?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-[var(--muted)]">We'll review your submission within 4 hours</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-[var(--muted)]">Schedule a personalized demo call</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-[var(--muted)]">Get your custom strategy recommendations</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                    <span className="text-[var(--muted)]">Start generating high-converting marketing content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
