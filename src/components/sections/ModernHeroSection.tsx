"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export function ModernHeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation with enhanced effects
      const tl = gsap.timeline({ delay: 0.8 });
      
      // Animated title with split text effect
      const titleWords = titleRef.current?.querySelectorAll('span') || [];
      tl.from(titleWords, {
        y: 150,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        stagger: 0.2
      })
      .from(subtitleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.8")
      .from(ctaRef.current, {
        y: 50,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "back.out(2)"
      }, "-=0.6");

      // Parallax scrolling effect
      gsap.to(heroRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Floating animation for buttons
      gsap.to(ctaRef.current?.querySelectorAll('button, a') || [], {
        y: 10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[60vh] sm:min-h-[80vh] md:min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 md:py-20 overflow-hidden">
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-bg/60 to-bg"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-conic from-accent/30 via-accent-2/20 to-transparent blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-l from-accent-2/20 to-transparent blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[600px] bg-gradient-to-r from-accent/15 to-transparent blur-3xl opacity-25"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Enhanced main title with multiple gradients */}
        <h1 
          ref={titleRef}
          className="text-center mb-4 sm:mb-6 md:mb-8 relative"
          style={{ 
            fontSize: 'clamp(3.5rem, 9vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.25
          }}
        >
          <span className="block bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent drop-shadow-2xl">
            Strategic Marketing
          </span>
          <span className="block body mt-2 sm:mt-3 md:mt-4 bg-gradient-to-r from-fg-muted to-white bg-clip-text text-transparent">
            that drives real results
          </span>
          <span className="block small mt-1 sm:mt-2 md:mt-3 bg-gradient-to-r from-accent-2 via-accent to-accent-2 bg-clip-text text-transparent animate-pulse tracking-wide">
            crafted by Brody Lee
          </span>
          
          {/* Glowing effect behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-2/20 blur-3xl -z-10 scale-110"></div>
        </h1>

        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl text-fg-muted max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed px-4 sm:px-0"
        >
          From brand strategy to campaign execution, I create marketing solutions that connect 
          with your audience and accelerate business growth through data-driven insights.
        </p>

        {/* Enhanced CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 sm:gap-4 md:gap-6 justify-center items-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0">
          <Link href="/audience-architect">
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-3xl bg-gradient-to-r from-accent via-accent-2 to-accent hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-accent/50 border border-accent/20 relative overflow-hidden group w-full sm:w-auto">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                Start Your Project
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-3xl border-2 border-accent/40 hover:border-accent hover:bg-accent/20 transition-all duration-500 backdrop-blur-sm relative overflow-hidden group w-full sm:w-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">View My Work</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
