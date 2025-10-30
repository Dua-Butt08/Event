"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserMenu } from '@/components/auth/UserMenu';
import { Button } from '@/components/ui-kit/Button';
import { useSession } from 'next-auth/react';

// Mega menu data structure
const megaMenuSections = {
  services: {
    title: "Our Services",
    icon: "🛠️",
    items: [
      {
        title: "Audience Architect™",
        description: "AI-powered marketing strategy generator",
        href: "/audience-architect",
        icon: "🎯"
      },
      {
        title: "Strategic Consulting", 
        description: "One-on-one marketing strategy development",
        href: "/contact?service=consulting",
        icon: "💡"
      },
      {
        title: "Content Strategy",
        description: "Comprehensive content planning and creation",
        href: "/contact?service=content",
        icon: "✍️"
      }
    ]
  },
  resources: {
    title: "Resources", 
    icon: "📚",
    items: [
      {
        title: "Case Studies",
        description: "Real client success stories and results",
        href: "/results/sample",
        icon: "📈"
      },
      {
        title: "Portfolio",
        description: "View our previous work and achievements",
        href: "/dashboard",
        icon: "📊"
      },
      {
        title: "Knowledge Base",
        description: "Marketing guides and best practices", 
        href: "/contact?type=resources",
        icon: "📖"
      }
    ]
  },
  company: {
    title: "Company",
    icon: "🏢", 
    items: [
      {
        title: "About Us",
        description: "Learn about our mission and expertise",
        href: "/about",
        icon: "👨‍💼"
      },
      {
        title: "Contact",
        description: "Get in touch for a consultation",
        href: "/contact",
        icon: "📞"
      },
      {
        title: "Terms & Privacy",
        description: "Legal information and policies",
        href: "/terms",
        icon: "📋"
      }
    ]
  }
};

export function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll animation for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Trigger the compact navbar when scrolled more than 20px
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isClickInsideNavigation = megaMenuRef.current && megaMenuRef.current.contains(target);
      const isClickInsideDropdown = megaMenuDropdownRef.current && megaMenuDropdownRef.current.contains(target);
      
      if (!isClickInsideNavigation && !isClickInsideDropdown) {
        setActiveMegaMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 300); // Increased delay to allow for link clicks
  };

  const handleLinkClick = (href: string) => {
    // Clear timeout and close menu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMegaMenu(null);
    
    // Use window.location for more reliable navigation
    window.location.href = href;
  };

  return (
    <>
      {/* Global CSS for mega menu animation */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md lg:fixed lg:top-0 transition-all duration-300 ease-in-out">
        <div className={`px-6 transition-all duration-300 ease-in-out ${isScrolled ? 'py-1' : 'py-2'}`}>
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center group">
              <div className={`w-[200px] relative group-hover:scale-105 transition-all duration-300 ease-in-out flex items-center ${isScrolled ? 'h-14' : 'h-20'}`}>
                <Image 
                  src="/logo.png" 
                  alt="Brody Lee Marketing Strategy" 
                  width={200} 
                  height={80}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - Hidden when logged in */}
            {!session && (
              <nav className="hidden lg:flex items-center gap-8" ref={megaMenuRef}>
                {/* Home */}
                <Link
                  href="/"
                  className="text-sm sm:text-base lg:text-lg font-medium text-foreground hover:text-accent transition-colors tracking-wide"
                >
                  Home
                </Link>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className="text-sm sm:text-base lg:text-lg font-medium text-foreground hover:text-accent transition-colors tracking-wide"
                >
                  Dashboard
                </Link>

                {/* Contact */}
                <Link
                  href="/contact"
                  className="text-sm sm:text-base lg:text-lg font-medium text-foreground hover:text-accent transition-colors tracking-wide"
                >
                  Contact
                </Link>

              {/* TEMPORARILY HIDDEN - Services with Mega Menu */}
              {/* <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 text-sm sm:text-base lg:text-lg font-medium text-foreground hover:text-accent transition-colors tracking-wide">
                  Services
                  <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div> */}

              {/* TEMPORARILY HIDDEN - Resources with Mega Menu */}
              {/* <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 text-sm sm:text-base lg:text-lg font-medium text-foreground hover:text-accent transition-colors tracking-wide">
                  Resources
                  <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div> */}

              {/* TEMPORARILY HIDDEN - Company with Mega Menu */}
              {/* <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('company')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 text-sm sm:text-base lg:text-lg font-medium text-foreground hover:text-accent transition-colors tracking-wide">
                  Company
                  <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div> */}

                {/* TEMPORARILY HIDDEN - Pricing - Direct Link */}
                {/* <Link
                  href="/pricing"
                  className="text-sm sm:text-base lg:text-lg font-medium text-foreground hover:text-accent transition-colors tracking-wide"
                >
                  Pricing
                </Link> */}
              </nav>
            )}

            {/* Right side - User Menu + Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <UserMenu />
              
              {/* Mobile Menu Button - Hidden when logged in */}
              {!session && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mega Menu Dropdown - Regenerated */}
      {activeMegaMenu && (
        <div 
          ref={megaMenuDropdownRef}
          className="fixed top-[73px] left-0 w-full bg-background/98 backdrop-blur-lg border-b border-border shadow-2xl z-[9999] hidden lg:block"
          style={{
            animation: 'slideDown 0.3s ease-out forwards'
          }}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{megaMenuSections[activeMegaMenu as keyof typeof megaMenuSections].icon}</span>
                  <h3 className="text-2xl font-bold text-foreground">
                    {megaMenuSections[activeMegaMenu as keyof typeof megaMenuSections].title}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {megaMenuSections[activeMegaMenu as keyof typeof megaMenuSections].items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleLinkClick(item.href)}
                      className="group p-4 rounded-xl border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 bg-card/80 hover:bg-card/95 text-left w-full"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {item.icon}
                        </span>
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-br from-accent/15 to-accent-2/15 rounded-xl p-6 border border-accent/30 backdrop-blur-sm">
                <h4 className="font-bold text-foreground mb-3 text-lg">
                  Ready to Get Started?
                </h4>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {activeMegaMenu === 'services' && "Transform your marketing with AI-powered strategies designed for results."}
                  {activeMegaMenu === 'resources' && "Explore our comprehensive resources and see real client success stories."}
                  {activeMegaMenu === 'company' && "Learn more about our mission and get in touch for a personalized consultation."}
                </p>
                <button
                  onClick={() => handleLinkClick(activeMegaMenu === 'services' ? '/forms' : activeMegaMenu === 'resources' ? '/results/sample' : '/contact')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent-2 text-white rounded-lg hover:scale-105 transition-all duration-300 text-sm font-medium"
                >
                  {activeMegaMenu === 'services' && "Start Free"}
                  {activeMegaMenu === 'resources' && "View Case Studies"}
                  {activeMegaMenu === 'company' && "Contact Us"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Enhanced Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center">
            <div className="w-16 h-16 relative flex items-center">
              <Image 
                src="/logo.png" 
                alt="Brody Lee Marketing Strategy" 
                width={64} 
                height={64}
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          <nav className="space-y-6">
            {/* Main Navigation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Menu
              </h3>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 text-foreground hover:bg-accent/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">🏠</span>
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 text-foreground hover:bg-accent/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">📊</span>
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 text-foreground hover:bg-accent/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">📞</span>
                <span className="font-medium">Contact</span>
              </Link>
            </div>

            {/* TEMPORARILY HIDDEN - Quick Actions */}
            {/* <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </h3>
              <Link
                href="/audience-architect"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-accent/10 to-accent-2/10 border border-accent/20 text-foreground hover:from-accent/20 hover:to-accent-2/20 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">🚀</span>
                <div>
                  <div className="font-medium">Start Free</div>
                  <div className="text-xs text-muted-foreground">AI Marketing Tools</div>
                </div>
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 text-foreground hover:bg-accent/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">💰</span>
                <span className="font-medium">Pricing</span>
              </Link>
            </div> */}

            {/* TEMPORARILY HIDDEN - Services */}
            {/* <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Services
              </h3>
              {megaMenuSections.services.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 text-foreground hover:bg-accent/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div> */}

            {/* TEMPORARILY HIDDEN - Resources */}
            {/* <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
              </h3>
              {megaMenuSections.resources.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 text-foreground hover:bg-accent/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div> */}

            {/* TEMPORARILY HIDDEN - Company */}
            {/* <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Company
              </h3>
              {megaMenuSections.company.items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 text-foreground hover:bg-accent/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div> */}
          </nav>

          {/* TEMPORARILY HIDDEN - Mobile CTA */}
          {/* <div className="mt-8 p-4 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-xl border border-accent/20">
            <h4 className="font-bold text-foreground mb-2">
              Ready to Transform Your Marketing?
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              Join 500+ businesses using AI-powered strategies.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white rounded-lg hover:scale-105 transition-all duration-300 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div> */}
        </div>
      </div>
    </>
  );
}
