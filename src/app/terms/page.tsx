"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TermsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.from(heroRef.current?.children || [], {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      });

      // Content sections animation
      gsap.from(contentRef.current?.querySelectorAll('.terms-section') || [], {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const lastUpdated = "January 1, 2024";

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--bg)] relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-elev)]/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-[min(500px,50vw)] h-[400px] bg-gradient-to-l from-[var(--accent)]/8 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[min(400px,40vw)] h-[300px] bg-gradient-to-r from-[var(--accent-2)]/8 to-transparent blur-3xl"></div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-[var(--accent)]/30 mb-6 sm:mb-8">
            <span className="text-sm font-medium text-[var(--accent)]">📋 Legal Information</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our services.
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="relative px-4 sm:px-6 md:px-10 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 sm:space-y-12">
            
            {/* Section 1 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">1. Acceptance of Terms</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                By accessing and using Brody Lee Marketing services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-[var(--muted)] leading-relaxed">
                These terms apply to all visitors, users, and others who access or use the service, including marketing strategy consultations, AI-powered form generation tools, and related services.
              </p>
            </div>

            {/* Section 2 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">2. Services Description</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                Brody Lee Marketing provides professional marketing strategy consulting and AI-powered business development tools, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-[var(--muted)] space-y-2 ml-4">
                <li>Audience Architect™ (ICP) generation</li>
                <li>Client value mapping and journey planning</li>
                <li>Content expansion and strategy development</li>
                <li>Event funnel blueprint creation</li>
                <li>Landing page strategy and optimization</li>
                <li>Brand strategy consultation</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">3. User Responsibilities</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-[var(--muted)] space-y-2 ml-4 mb-4">
                <li>Providing accurate and complete information when using our services</li>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>Using the services in compliance with applicable laws and regulations</li>
                <li>Respecting intellectual property rights</li>
                <li>Not using the services for any unlawful or prohibited purposes</li>
              </ul>
              <p className="text-[var(--muted)] leading-relaxed">
                You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the service without express written permission.
              </p>
            </div>

            {/* Section 4 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">4. Intellectual Property</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                All content, features, and functionality of our services, including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Brody Lee Marketing or its licensors.
              </p>
              <p className="text-[var(--muted)] leading-relaxed">
                The results generated through our AI-powered tools are provided to you for your business use. However, the underlying technology, methodologies, and frameworks remain our intellectual property.
              </p>
            </div>

            {/* Section 5 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">5. Data Privacy & Security</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                We take your privacy seriously. All data processing is conducted server-side with appropriate security measures. Your information is:
              </p>
              <ul className="list-disc list-inside text-[var(--muted)] space-y-2 ml-4 mb-4">
                <li>Processed securely with end-to-end encryption</li>
                <li>Stored temporarily and accessible via unique IDs</li>
                <li>Never shared with third parties without your consent</li>
                <li>Subject to your data retention preferences</li>
              </ul>
              <p className="text-[var(--muted)] leading-relaxed">
                For detailed information about data handling, please refer to our Privacy Policy.
              </p>
            </div>

            {/* Section 6 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">6. Service Availability</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                We strive to maintain high service availability but do not guarantee uninterrupted access. Services may be temporarily unavailable due to:
              </p>
              <ul className="list-disc list-inside text-[var(--muted)] space-y-2 ml-4">
                <li>Scheduled maintenance and updates</li>
                <li>Technical difficulties or server issues</li>
                <li>Third-party service dependencies</li>
                <li>Force majeure events beyond our control</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">7. Limitation of Liability</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                Brody Lee Marketing shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
              <p className="text-[var(--muted)] leading-relaxed">
                Our services provide strategic guidance and tools to assist in your marketing efforts. Results may vary based on implementation, market conditions, and other factors beyond our control.
              </p>
            </div>

            {/* Section 8 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">8. Termination</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                Either party may terminate this agreement at any time. Upon termination:
              </p>
              <ul className="list-disc list-inside text-[var(--muted)] space-y-2 ml-4">
                <li>Your access to the services will be discontinued</li>
                <li>Data retention will follow your specified preferences</li>
                <li>Previously generated results remain accessible via your saved links</li>
                <li>Certain provisions will survive termination as applicable</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">9. Changes to Terms</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of the service after changes are posted constitutes acceptance of the modified terms.
              </p>
              <p className="text-[var(--muted)] leading-relaxed">
                We encourage you to review these terms periodically to stay informed of any updates.
              </p>
            </div>

            {/* Section 10 */}
            <div className="terms-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">10. Contact Information</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-[var(--bg)]/50 rounded-lg p-4 space-y-2">
                <p className="text-[var(--text)] font-medium">Brody Lee Marketing</p>
                <p className="text-[var(--muted)]">Email: hello@brodyleemarketing.com</p>
                <p className="text-[var(--muted)]">Website: <Link href="/" className="text-[var(--accent)] hover:underline">brodyleemarketing.com</Link></p>
              </div>
            </div>

          </div>

          {/* CTA Section */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent-2)]/10 to-[var(--accent)]/10 rounded-3xl p-8 sm:p-12 backdrop-blur-sm border border-[var(--accent)]/20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent">
                Ready to Get Started?
              </h2>
              <p className="text-[var(--muted)] mb-6 sm:mb-8 leading-relaxed">
                Now that you've reviewed our terms, explore our AI-powered marketing tools 
                and start building your strategic marketing foundation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Link href="/forms">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[var(--accent)]/25">
                    Explore Services
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 hover:scale-105 transition-all duration-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}