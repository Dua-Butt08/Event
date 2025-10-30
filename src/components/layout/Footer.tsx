"use client";

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Audience Architect™', href: '/results/icp' },
      { name: 'Content Compass™', href: '/results/content-compass' },
      { name: 'Message Multiplier™', href: '/results/message-multiplier' },
      { name: 'Event Funnels', href: '/results/funnel' },
      { name: 'Landing Pages', href: '/results/landing' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Portfolio', href: '/dashboard' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Case Studies', href: '/results/sample' },
    ],
    legal: [
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    contact: [
      { name: 'Get Started', href: '/audience-architect' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'About', href: '/about#contact' },
    ]
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987S24.005 18.607 24.005 11.987C24.005 5.367 18.638.001 12.017.001zM8.449 16.988c-2.508 0-4.54-2.033-4.54-4.54s2.032-4.54 4.54-4.54c2.508 0 4.54 2.032 4.54 4.54s-2.032 4.54-4.54 4.54zm7.119 0c-2.508 0-4.54-2.033-4.54-4.54s2.032-4.54 4.54-4.54c2.508 0 4.54 2.032 4.54 4.54s-2.032 4.54-4.54 4.54z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="relative bg-[var(--bg-elev)] border-t border-[var(--border)] mt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg)] opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-[min(300px,40vw)] h-[200px] bg-gradient-to-r from-[var(--accent)]/5 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-[min(400px,50vw)] h-[150px] bg-gradient-to-l from-[var(--accent-2)]/5 to-transparent blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        {/* Main footer content */}
        <div className="py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 group mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                  B
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--text)]">
                    Brody Lee
                  </div>
                  <div className="text-sm text-[var(--muted)] font-medium">
                    Marketing Strategy
                  </div>
                </div>
              </Link>
              <p className="text-[var(--muted)] leading-relaxed mb-6 max-w-md">
                Strategic marketing and brand development that drives real results. 
                From concept to execution, I help businesses build meaningful connections 
                with their audiences.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:scale-105"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-4 sm:mb-6">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & Resources */}
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-4 sm:mb-6">Company</h3>
              <ul className="space-y-3 mb-8">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <h3 className="font-semibold text-[var(--text)] mb-4 sm:mb-6">Contact</h3>
              <ul className="space-y-3">
                {footerLinks.contact.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-[var(--border)] py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-[var(--muted)] text-sm">
              © {currentYear} Brody Lee Marketing. All rights reserved.
            </div>
            
            {/* Legal links */}
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}