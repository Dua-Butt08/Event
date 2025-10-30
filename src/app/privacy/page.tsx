import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FlameAmbient } from '@/components/visuals/FlameAmbient';

export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen">
      <FlameAmbient />
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-[var(--accent)]/30 mb-6 sm:mb-8 backdrop-blur-sm">
              <span className="text-sm font-medium text-[var(--accent)]">🔒 Privacy Policy</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent leading-tight">
              Your Privacy
              <span className="block bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                Matters to Us
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-[var(--muted)] max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
              We're committed to protecting your privacy and being transparent about how we collect, 
              use, and safeguard your information.
            </p>
            
            <div className="text-sm text-[var(--muted)] mb-8">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-10">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            
            {/* Section 1 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">1. Information We Collect</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <h3 className="text-lg font-semibold text-[var(--text)] mt-6 mb-3">Information You Provide:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Contact information (name, email address) when you reach out or use our services</li>
                  <li>Business information you provide through our marketing strategy forms</li>
                  <li>Content and data you submit for analysis or strategy development</li>
                  <li>Communication preferences and feedback</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-[var(--text)] mt-6 mb-3">Information We Collect Automatically:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Usage data and analytics about how you interact with our website</li>
                  <li>Device information, browser type, and IP address</li>
                  <li>Cookies and similar tracking technologies (see Cookie Policy below)</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">2. How We Use Your Information</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and improve our marketing strategy services</li>
                  <li>Generate AI-powered marketing content and recommendations</li>
                  <li>Communicate with you about our services and respond to inquiries</li>
                  <li>Analyze and improve our website performance and user experience</li>
                  <li>Send you relevant marketing communications (with your consent)</li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>
                <p className="mt-4 p-4 bg-[var(--accent)]/10 rounded-lg border border-[var(--accent)]/20">
                  <strong className="text-[var(--accent)]">Important:</strong> We process all AI-generated content server-side 
                  to ensure your data privacy. Your inputs never leave our secure environment for third-party AI processing.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">3. Data Security & Protection</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure server-side processing of all AI-generated content</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access controls and employee training</li>
                  <li>Secure data storage with regular backups</li>
                </ul>
                <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-400 mb-2">Privacy-First Approach</h4>
                      <p className="text-sm">All AI processing happens on our secure servers. Your data never leaves our control for external AI API calls.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">4. Data Sharing & Disclosure</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>We do not sell, trade, or rent your personal information. We may share your information only in these limited circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> Trusted third-party services that help us operate our business (hosting, analytics, payment processing)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
                <p className="mt-4 font-semibold text-[var(--text)]">
                  We never share your business data or AI-generated content with third parties for their marketing purposes.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">5. Your Rights & Choices</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
                  <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request that we delete your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:privacy@brodyleemarketing.com" className="text-[var(--accent)] hover:text-[var(--accent-2)] underline">
                    privacy@brodyleemarketing.com
                  </a>
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">6. Data Retention</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>We retain your information only as long as necessary to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide you with our services</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-[var(--text)]">You control your data:</strong> You can request deletion of your 
                  information at any time, and we will delete it within 30 days unless we're required to retain 
                  it for legal purposes.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">7. Cookies & Tracking</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and performance</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Ensure website security and prevent fraud</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings. However, disabling cookies may affect 
                  the functionality of our website.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">8. International Data Transfers</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>
                  Our services are hosted in the United States. If you are located outside the US, your information 
                  will be transferred to and processed in the US. We ensure appropriate safeguards are in place to 
                  protect your information in accordance with this Privacy Policy.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">9. Children's Privacy</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>
                  Our services are not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If you believe we have collected information from 
                  a child under 13, please contact us immediately.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="privacy-section bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">10. Changes to This Policy</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending you an email notification (if you've provided your email)</li>
                  <li>Displaying a prominent notice on our website</li>
                </ul>
                <p className="mt-4">
                  Your continued use of our services after any changes constitutes your acceptance of the updated policy.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="privacy-section bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-2)]/10 backdrop-blur-sm border border-[var(--accent)]/20 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4 sm:mb-6">Contact Us</h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong className="text-[var(--text)]">Email:</strong> <a href="mailto:privacy@brodyleemarketing.com" className="text-[var(--accent)] hover:text-[var(--accent-2)] underline">privacy@brodyleemarketing.com</a></p>
                  <p><strong className="text-[var(--text)]">General Contact:</strong> <a href="mailto:hello@brodyleemarketing.com" className="text-[var(--accent)] hover:text-[var(--accent-2)] underline">hello@brodyleemarketing.com</a></p>
                  <p><strong className="text-[var(--text)]">Website:</strong> <a href="https://brodyleemarketing.com" className="text-[var(--accent)] hover:text-[var(--accent-2)] underline">brodyleemarketing.com</a></p>
                </div>
                <p className="text-sm mt-6 pt-4 border-t border-[var(--border)]">
                  © {currentYear} Brody Lee Marketing. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent-2)]/10 to-[var(--accent)]/10 rounded-3xl p-8 sm:p-12 backdrop-blur-sm border border-[var(--accent)]/20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent">
                Ready to Get Started?
              </h2>
              <p className="text-[var(--muted)] mb-6 sm:mb-8 leading-relaxed">
                Now that you understand how we protect your privacy, explore our AI-powered marketing tools 
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
        </section>
      </div>
    </div>
  );
}