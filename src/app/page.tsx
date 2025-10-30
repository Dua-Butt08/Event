"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FuturisticBackground } from "@/components/visuals/FuturisticBackground";
import { ModernHeroSection } from "@/components/sections/ModernHeroSection";
import { ModernFeaturesSection } from "@/components/sections/ModernFeaturesSection";
import { useScrollAnimations } from "@/hooks/useScrollAnimations";
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    number: 1,
    title: "Discovery & Strategy",
    description: "Deep dive into your brand, market, and goals to craft the perfect approach.",
    icon: "🔍"
  },
  {
    number: 2,
    title: "Creative Development",
    description: "Design compelling campaigns and content that resonates with your audience.",
    icon: "🎨"
  },
  {
    number: 3,
    title: "Launch & Execute",
    description: "Deploy your marketing campaigns across the right channels at the right time.",
    icon: "🚀"
  },
  {
    number: 4,
    title: "Optimize & Scale",
    description: "Monitor performance, analyze results, and refine for maximum impact.",
    icon: "📈"
  }
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { scrollY } = useScrollAnimations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hide all steps except first
      gsap.set(stepsRef.current.slice(1), { 
        opacity: 0.3,
        scale: 0.9,
        y: 20
      });

      // Create timeline for the animation sequence
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "top 30%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Animate all steps to be fully revealed when progress reaches 1
            stepsRef.current.forEach((step) => {
              const stepProgress = Math.min(progress * 1.5, 1); // Faster reveal
              
              gsap.to(step, {
                opacity: stepProgress,
                scale: 0.9 + (stepProgress * 0.1),
                y: 20 - (stepProgress * 20),
                duration: 0.3,
                ease: "power2.out"
              });
              
              // Add enhanced effect to all step circles
              gsap.to(step.querySelector('.step-circle'), {
                scale: 1 + (stepProgress * 0.1),
                duration: 0.3,
                ease: "power2.out"
              });
            });
          }
        }
      });

      // Auto-play animation on first view - reveal all at once
      const autoPlayTl = gsap.timeline({ delay: 0.5 });
      
      autoPlayTl.to(stepsRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-b from-bg via-bg to-bg-elev">
      {/* Futuristic 3D Background */}
      <FuturisticBackground scrollY={scrollY} />
      
      {/* Modern Hero Section */}
      <ModernHeroSection />
      
      {/* Modern Features Section */}
      <ModernFeaturesSection />

      {/* How it works - Enhanced */}
      <section ref={sectionRef} className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:py-32">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-elev)]/90 to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-[min(600px,50vw)] h-[400px] bg-gradient-to-l from-[var(--accent)]/8 to-transparent blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-[min(500px,40vw)] h-[350px] bg-gradient-to-r from-[var(--accent-2)]/8 to-transparent blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-[var(--accent)]/30 mb-6">
              <span className="text-sm font-medium text-[var(--accent)]">🚀 Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.2' }}>
              How I Work
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
              A proven methodology that transforms brands and drives results. 
              From strategy to execution, every step is designed for maximum impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12 md:mb-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                ref={(el) => {
                  if (el) stepsRef.current[index] = el;
                }}
                className="text-center relative group"
              >
                {/* Enhanced Step Circle */}
                <div className="step-circle w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl mx-auto mb-4 sm:mb-6 shadow-2xl relative overflow-hidden group-hover:scale-110 transition-all duration-500">
                  <span className="relative z-10">{step.number}</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] opacity-0 group-hover:opacity-100 animate-gentle-breathe transition-opacity duration-300"></div>
                  {/* Floating ring effect */}
                  <div className="absolute -inset-2 rounded-full border-2 border-[var(--accent)]/20 animate-soft-glow"></div>
                </div>
                
                {/* Enhanced Step Icon */}
                <div className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 group-hover:scale-125 transition-transform duration-300">{step.icon}</div>
                
                {/* Enhanced Step Content */}
                <div className="bg-[var(--card)]/40 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-4 sm:p-6 group-hover:border-[var(--accent)]/40 transition-all duration-300 group-hover:scale-105 group-hover:bg-[var(--card)]/60">
                  <h3 className="font-bold mb-2 sm:mb-3 text-lg sm:text-xl text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed group-hover:text-[var(--text)] transition-colors">
                    {step.description}
                  </p>
                </div>
                
                {/* Connection Line (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute -bottom-4 left-1/2 w-px h-8 bg-gradient-to-b from-[var(--accent)] to-transparent -translate-x-1/2"></div>
                )}
                
                {/* Floating elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Enhanced Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent-2)]/10 to-[var(--accent)]/10 rounded-3xl p-8 backdrop-blur-sm border border-[var(--accent)]/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent pb-1" style={{ lineHeight: '1.3' }}>
                Ready to Transform Your Brand?
              </h3>
              <p className="text-[var(--muted)] mb-6">
                Let's create marketing strategies that drive real business growth and meaningful connections with your audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/audience-architect">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-12 py-6 rounded-2xl bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[var(--accent)]/25 group">
                    Start Your Project
                    <svg 
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-12 py-6 rounded-2xl border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 hover:scale-105 transition-all duration-300">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for teams - Fixed */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--bg-elev)]/60 to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-[min(400px,40vw)] h-[300px] bg-gradient-to-r from-[var(--accent-2)]/8 to-transparent blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-[min(500px,50vw)] h-[350px] bg-gradient-to-l from-[var(--accent)]/8 to-transparent blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-[var(--accent)]/30 mb-6">
                  <span className="text-sm font-medium text-[var(--accent)]">🚀 Team Collaboration</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent pb-2" style={{ lineHeight: '1.2' }}>
                  Built for Teams
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] leading-relaxed">
                  Streamline your team&apos;s workflow with consistent, professional tools designed for collaboration and efficiency.
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)]/30 backdrop-blur-sm border border-[var(--border)]/50 hover:border-[var(--accent)]/40 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">Shared Structure Across Forms</h3>
                    <p className="text-[var(--muted)] leading-relaxed">Consistent templates and workflows ensure your team maintains brand coherence and professional standards across all generated content.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)]/30 backdrop-blur-sm border border-[var(--border)]/50 hover:border-[var(--accent)]/40 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">Clear Progress & Autosave</h3>
                    <p className="text-[var(--muted)] leading-relaxed">Visual progress indicators and automatic saving ensure no work is lost, allowing team members to collaborate seamlessly across sessions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)]/30 backdrop-blur-sm border border-[var(--border)]/50 hover:border-[var(--accent)]/40 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">Markdown Output for Integration</h3>
                    <p className="text-[var(--muted)] leading-relaxed">Standardized Markdown formatting makes it easy to integrate results into documentation systems, CMS platforms, and team workflows.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link href="/results/sample" className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent-2)] transition-colors font-medium group">
                  See how results render
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[var(--card)]/60 to-[var(--card)]/20 backdrop-blur-sm border border-[var(--border)]/50 rounded-3xl p-8 hover:border-[var(--accent)]/40 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white font-bold">✓</div>
                    <span className="text-lg font-semibold text-[var(--text)]">Team Workflow Status</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elev)]/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-gentle-fade"></div>
                      <span className="text-sm text-[var(--text)]">ICP Generation: Complete</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elev)]/50">
                      <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-gentle-fade"></div>
                      <span className="text-sm text-[var(--text)]">Value Map: In Progress</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elev)]/50">
                      <div className="w-2 h-2 bg-[var(--muted)] rounded-full"></div>
                      <span className="text-sm text-[var(--muted)]">Content Expansion: Pending</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-[var(--border)]/50 pt-4">
                    <div className="text-sm text-[var(--muted)] mb-2">Export Format</div>
                    <div className="bg-[var(--bg)]/50 rounded-lg p-3 font-mono text-sm text-[var(--accent)]">
                      ❯ results.md
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full flex items-center justify-center text-white text-sm font-bold animate-bounce">📊</div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-[var(--accent-2)] to-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold opacity-80">🎆</div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & control */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[var(--bg-elev)]/50 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-[min(350px,40vw)] h-[250px] bg-gradient-to-r from-[var(--accent)]/6 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[min(400px,50vw)] h-[300px] bg-gradient-to-l from-[var(--accent-2)]/6 to-transparent blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-[var(--card)]/60 to-[var(--card)]/20 backdrop-blur-sm border border-[var(--border)]/50 rounded-3xl p-6 sm:p-8 hover:border-[var(--accent)]/40 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold">🔒</div>
                    <span className="text-lg font-semibold text-[var(--text)]">Security Dashboard</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--bg-elev)]/50 rounded-xl p-4 text-center hover:bg-[var(--bg-elev)]/70 transition-colors">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-gentle-fade"></div>
                      </div>
                      <div className="text-sm font-medium text-[var(--text)]">Encrypted</div>
                      <div className="text-xs text-[var(--muted)]">Data Transfer</div>
                    </div>
                    
                    <div className="bg-[var(--bg-elev)]/50 rounded-xl p-4 text-center hover:bg-[var(--bg-elev)]/70 transition-colors">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[var(--accent)] rounded-full animate-gentle-fade"></div>
                      </div>
                      <div className="text-sm font-medium text-[var(--text)]">Server-Side</div>
                      <div className="text-xs text-[var(--muted)]">Generating</div>
                    </div>
                    
                    <div className="bg-[var(--bg-elev)]/50 rounded-xl p-4 text-center hover:bg-[var(--bg-elev)]/70 transition-colors">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-gentle-fade"></div>
                      </div>
                      <div className="text-sm font-medium text-[var(--text)]">Temporary</div>
                      <div className="text-xs text-[var(--muted)]">Storage</div>
                    </div>
                    
                    <div className="bg-[var(--bg-elev)]/50 rounded-xl p-4 text-center hover:bg-[var(--bg-elev)]/70 transition-colors">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-gentle-fade"></div>
                      </div>
                      <div className="text-sm font-medium text-[var(--text)]">User</div>
                      <div className="text-xs text-[var(--muted)]">Controlled</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[var(--border)]/50 pt-4">
                    <div className="text-sm text-[var(--muted)] mb-2">Data Retention Policy</div>
                    <div className="bg-[var(--bg)]/50 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2 text-green-400">
                        <span>✓</span>
                        <span>You control data retention</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating security badges */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">🔐</div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full flex items-center justify-center text-white font-bold opacity-80">🛡️</div>
            </div>
            
            {/* Right Content */}
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-400/20 border border-green-500/30 mb-6">
                  <span className="text-sm font-medium text-green-400">🔒 Privacy First</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[var(--text)] to-green-400 bg-clip-text text-transparent">
                  Privacy & Control
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] leading-relaxed">
                  Your data security and privacy are our top priorities. Complete transparency in how we handle your information.
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)]/30 backdrop-blur-sm border border-[var(--border)]/50 hover:border-green-400/40 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-green-400 transition-colors">Server-Side Processing</h3>
                    <p className="text-[var(--muted)] leading-relaxed">Your inputs are processed securely by Ential AI&apos;s servers. No AI calls are made from your browser or Next.js, ensuring maximum security and privacy.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)]/30 backdrop-blur-sm border border-[var(--border)]/50 hover:border-green-400/40 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-green-400 transition-colors">Temporary Storage</h3>
                    <p className="text-[var(--muted)] leading-relaxed">Results are temporarily saved to secure storage and accessible via unique IDs. No permanent data retention without your explicit consent.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--card)]/30 backdrop-blur-sm border border-[var(--border)]/50 hover:border-green-400/40 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-green-400 transition-colors">Full Data Control</h3>
                    <p className="text-[var(--muted)] leading-relaxed">You maintain complete control over your data retention. Purge files anytime and manage your data according to your privacy preferences.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link href="/privacy" className="inline-flex items-center text-green-400 hover:text-emerald-300 transition-colors font-medium group">
                  Read data handling notes
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-elev)]/80 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[min(500px,50vw)] h-[300px] bg-gradient-to-l from-[var(--accent)]/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[min(400px,40vw)] h-[250px] bg-gradient-to-r from-[var(--accent-2)]/10 to-transparent blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-[var(--accent)]/30 mb-6">
              <span className="text-sm font-medium text-[var(--accent)]">❓ Frequently Asked</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent">
              Questions & Answers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto">
              Everything you need to know about getting started with AI-powered form generation
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8 hover:border-[var(--accent)]/40 transition-all duration-300 group hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">Where are my results?</h3>
              <p className="text-[var(--muted)] leading-relaxed">Each form submission generates a unique result ID. You can access your results by navigating to <code className="bg-[var(--bg-elev)] px-2 py-1 rounded text-[var(--accent)] font-mono text-sm">/results/[id]</code> or use the provided link after form completion.</p>
            </div>
            
            <div className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8 hover:border-[var(--accent)]/40 transition-all duration-300 group hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">Can I edit and re-run forms?</h3>
              <p className="text-[var(--muted)] leading-relaxed">Absolutely! You can reopen any form with your previous data by adding <code className="bg-[var(--bg-elev)] px-2 py-1 rounded text-[var(--accent)] font-mono text-sm">?prefill=your-result-id</code> to the form URL. This allows you to iterate and refine your results.</p>
            </div>
            
            <div className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8 hover:border-[var(--accent)]/40 transition-all duration-300 group hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">Can I switch AI providers?</h3>
              <p className="text-[var(--muted)] leading-relaxed">Yes! Our platform supports multiple AI providers. You can configure your preferred AI provider through environment variables and redeploy. This gives you flexibility and control over your AI processing.</p>
            </div>
            
            <div className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8 hover:border-[var(--accent)]/40 transition-all duration-300 group hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">Do I need an account to try it?</h3>
              <p className="text-[var(--muted)] leading-relaxed">Not at all! You can explore our capabilities without signing up. Try our sample results at <code className="bg-[var(--bg-elev)] px-2 py-1 rounded text-[var(--accent)] font-mono text-sm">/results/sample</code> to see the quality and format of our AI-generated content.</p>
            </div>
            
            <div className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8 hover:border-[var(--accent)]/40 transition-all duration-300 group hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">How secure is my data?</h3>
              <p className="text-[var(--muted)] leading-relaxed">Your data security is our priority. All inputs are processed securely, results are temporarily stored, and you maintain full control over data retention. No AI calls are made from your browser, ensuring privacy and security.</p>
            </div>
            
            <div className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl p-6 sm:p-8 hover:border-[var(--accent)]/40 transition-all duration-300 group hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">What formats do results come in?</h3>
              <p className="text-[var(--muted)] leading-relaxed">All results are generated in clean, structured Markdown format, making them perfect for documentation, CMS integration, or further editing. You can easily copy, export, or integrate the content into your existing workflows.</p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <div className="bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent-2)]/10 to-[var(--accent)]/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-[var(--accent)]/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent">
                Ready to Get Started?
              </h3>
              <p className="text-sm sm:text-base text-[var(--muted)] mb-6">
                Experience the power of AI-driven form generation and transform your marketing workflow today.
              </p>
              <Link href="/audience-architect">
                <Button size="lg" className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[var(--accent)]/25">
                  Start with Audience Architect™
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
