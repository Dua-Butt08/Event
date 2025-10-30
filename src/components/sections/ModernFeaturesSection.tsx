"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    id: 'icp',
    title: 'Audience Architect™',
    description: 'Deep persona with real fears, desires, and psychological drivers that motivate purchase decisions.',
    detailedDescription: 'Create comprehensive client personas with demographic data, pain points, emotional triggers, and transformation goals.',
    href: '/results/icp',
    icon: '🎯',
    gradient: 'from-blue-500 to-cyan-500',
    color: '#ff6b35',
    benefits: ['Precise targeting', 'Higher conversions', 'Better messaging'],
    timeToComplete: '15 min'
  },
  {
    id: 'valueMap',
    title: 'Content Compass™',
    description: 'Strategic journey from current state to desired transformation with actionable milestones.',
    detailedDescription: 'Map the complete customer journey with five key milestones and content strategy for each stage.',
    href: '/results/content-compass',
    icon: '🗺️',
    gradient: 'from-green-500 to-emerald-500',
    color: '#4ade80',
    benefits: ['Clear roadmap', 'Content strategy', 'Customer journey'],
    timeToComplete: '10 min'
  },
  {
    id: 'contentExpander',
    title: 'Message Multiplier™',
    description: 'Generate 10 micro-ideas for every subtopic, creating endless content possibilities.',
    detailedDescription: 'Transform your value map into a content goldmine with detailed micro-ideas for each milestone.',
    href: '/results/message-multiplier',
    icon: '💡',
    gradient: 'from-purple-500 to-violet-500',
    color: '#a8a8a8',
    benefits: ['Content abundance', 'Topic variety', 'Engagement boost'],
    timeToComplete: '8 min'
  },
  {
    id: 'funnel',
    title: 'Event Funnel Blueprint',
    description: 'Complete conversion funnel with hero copy, ticket strategy, and lead capture systems.',
    detailedDescription: 'Design high-converting event funnels with compelling copy, urgency tactics, and social proof.',
    href: '/results/funnel',
    icon: '🚀',
    gradient: 'from-orange-500 to-red-500',
    color: '#f87171',
    benefits: ['Higher attendance', 'Revenue optimization', 'Automated follow-up'],
    timeToComplete: '20 min'
  },
  {
    id: 'landing',
    title: 'Landing Page Blueprint',
    description: 'Conversion-optimized page structure with all essential elements for maximum impact.',
    detailedDescription: 'Build high-converting landing pages with proven frameworks and persuasive copy elements.',
    href: '/results/landing',
    icon: '📄',
    gradient: 'from-pink-500 to-rose-500',
    color: '#ff6b35',
    benefits: ['Higher conversions', 'Professional design', 'Proven frameworks'],
    timeToComplete: '12 min'
  }
];

export function ModernFeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [visibleCard, setVisibleCard] = useState<string | null>(null);
  const [, setAutoplayIndex] = useState(0);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const ctx = gsap.context(() => {
      // Enhanced title animation with multiple elements
      gsap.from(titleRef.current?.children || [], {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 75%",
          end: "bottom 25%"
        }
      });

      // Enhanced cards animation with improved timing
      gsap.from(gridRef.current?.children || [], {
        y: 120,
        opacity: 0,
        scale: 0.7,
        rotationY: 15,
        duration: 1,
        ease: "back.out(1.2)",
        stagger: {
          amount: 0.6,
          from: "start"
        },
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          end: "bottom 20%"
        }
      });

      // Mobile ScrollTrigger for each card
      if (cardRefs.current.length > 0) {
        cardRefs.current.forEach((cardRef, index) => {
          if (cardRef) {
            ScrollTrigger.create({
              trigger: cardRef,
              start: "top 70%",
              end: "bottom top",
              markers: false,
              onEnter: () => {
                const feature = features[index];
                if (feature) setVisibleCard(feature.id);
              },
              onLeave: () => {
                setVisibleCard(null);
              },
              onEnterBack: () => {
                const feature = features[index];
                if (feature) setVisibleCard(feature.id);
              },
              onLeaveBack: () => {
                setVisibleCard(null);
              }
            });
          }
        });
      }

      // Enhanced parallax effect
      gsap.to(sectionRef.current, {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });

    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Autoplay functionality for desktop
  useEffect(() => {
    if (!isMobile && !hoveredCard) {
      autoplayTimerRef.current = setInterval(() => {
        setAutoplayIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % features.length;
          const feature = features[newIndex];
          if (feature) setVisibleCard(feature.id);
          return newIndex;
        });
      }, 2000);
    } else {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isMobile, hoveredCard]);

  const handleMouseEnter = (featureId: string) => {
    if (!isMobile) {
      setHoveredCard(featureId);
      setVisibleCard(featureId);
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHoveredCard(null);
      setVisibleCard(null);
    }
  };

  return (
    <section ref={sectionRef} className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-elev/60 to-transparent"></div>
      <div className="absolute top-1/3 right-0 w-[min(700px,50vw)] h-[500px] bg-gradient-to-l from-accent/12 to-transparent blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-[min(500px,40vw)] h-[400px] bg-gradient-to-r from-accent-2/12 to-transparent blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(300px,60vw)] h-[300px] bg-gradient-to-r from-accent/5 to-accent-2/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced section title */}
        <div ref={titleRef} className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-accent/20 to-accent-2/20 border border-accent/30 mb-6 sm:mb-8 backdrop-blur-sm">
            <span className="text-sm font-medium text-accent">✨ AI-Powered Tools</span>
          </div>
          <h2 className="h1 text-center mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
              What you can generate
            </span>
          </h2>
          <p className="body text-fg-muted max-w-4xl mx-auto">
            Transform your marketing strategy with our suite of AI-powered tools designed for modern businesses.
            <span className="block mt-2 text-accent font-medium">Choose your path to marketing excellence.</span>
          </p>
        </div>

        {/* Enhanced features grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const isCardVisible = visibleCard === feature.id || hoveredCard === feature.id;
            const hasActiveState = isCardVisible || (!isMobile && !hoveredCard && visibleCard === feature.id);
            
            return (
              <div 
                key={feature.id}
                ref={(el: HTMLDivElement | null) => {
                  if (el) cardRefs.current[index] = el;
                }}
              >
                <Link href={feature.href}>
                  <Card 
                    className={`group relative h-full cursor-pointer border-border/50 bg-gradient-to-b from-card/60 to-card/30 backdrop-blur-sm transition-all duration-500 overflow-hidden ${
                      hasActiveState ? 'border-accent/50 scale-105 -translate-y-2' : 'hover:border-accent/50 hover:scale-105 hover:-translate-y-2'
                    }`}
                    onMouseEnter={() => handleMouseEnter(feature.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Enhanced animated background */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        hasActiveState ? 'opacity-10' : 'opacity-0 group-hover:opacity-10'
                      }`}
                      style={{ 
                        background: `linear-gradient(135deg, ${feature.color}40, ${feature.color}10, transparent)` 
                      }}
                    ></div>
                    
                    {/* Enhanced floating particles */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${
                      hasActiveState ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="absolute top-6 right-6 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                      <div className="absolute bottom-8 left-8 w-2 h-2 bg-accent-2 rounded-full animate-pulse animation-delay-300"></div>
                      <div className="absolute top-1/2 left-6 w-2 h-2 bg-accent rounded-full animate-pulse animation-delay-700"></div>
                      <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-accent-2 rounded-full animate-pulse animation-delay-500"></div>
                    </div>
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${
                      hasActiveState ? 'opacity-20' : 'opacity-0 group-hover:opacity-20'
                    }`}>
                      <div 
                        className="absolute inset-2 rounded-2xl blur-xl" 
                        style={{ backgroundColor: feature.color }}
                      ></div>
                    </div>
                    
                    <CardHeader className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
                      {/* Enhanced header with time badge */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className={`card-icon text-3xl sm:text-4xl md:text-5xl transform transition-all duration-500 ${
                          hasActiveState ? 'scale-125 rotate-12' : 'group-hover:scale-125 group-hover:rotate-12'
                        }`}>
                          {feature.icon}
                        </div>
                        <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                          {feature.timeToComplete}
                        </div>
                      </div>
                      
                      {/* Enhanced content */}
                      <CardTitle className={`text-xl sm:text-2xl mb-3 sm:mb-4 transition-colors duration-300 leading-tight ${
                        hasActiveState ? 'text-accent' : 'group-hover:text-accent'
                      }`}>
                        {feature.title}
                      </CardTitle>
                      
                      <CardDescription className="text-fg-muted leading-relaxed mb-4 sm:mb-6 flex-grow text-sm sm:text-base">
                        {isCardVisible ? feature.detailedDescription : feature.description}
                      </CardDescription>
                      
                      {/* Benefits list */}
                      <div className="mb-4 sm:mb-6">
                        <div className="grid grid-cols-1 gap-2">
                          {feature.benefits.map((benefit, idx) => (
                            <div 
                              key={idx} 
                              className={`flex items-center text-sm text-fg-muted transition-all duration-500 ${
                                hasActiveState ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              }`}
                              style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                              <div 
                                className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                                style={{ backgroundColor: feature.color }}
                              ></div>
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Enhanced hover CTA */}
                      <div className="mt-auto">
                        <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-accent/10 to-accent-2/10 border border-accent/20 transition-all duration-500 ${
                          hasActiveState ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                        }`}>
                          <span className="text-accent font-medium text-sm sm:text-base">Start Creating</span>
                          <div className="flex items-center text-accent">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* Enhanced bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-accent/10 to-accent-2/10 border border-accent/20 backdrop-blur-sm">
            <span className="text-accent font-medium mr-2">🚀</span>
            <span className="text-fg-muted text-sm sm:text-base">All tools work together seamlessly</span>
          </div>
        </div>
      </div>
    </section>
  );
}