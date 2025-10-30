"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    number: 1,
    title: "Pick a form",
    description: "Choose ICP, Value Map, Message Multiplier™, Funnel, or Landing.",
    icon: "📝"
  },
  {
    number: 2,
    title: "Answer focused questions",
    description: "Multi-step forms with saved progress and validation.",
    icon: "💭"
  },
  {
    number: 3,
    title: "Ential AI runs your prompts",
    description: "Your flows return a Markdown report.",
    icon: "🤖"
  },
  {
    number: 4,
    title: "Review & export",
    description: "Copy, download .md, or go back and edit.",
    icon: "📄"
  }
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hide all steps except first
      gsap.set(stepsRef.current.slice(1), { 
        opacity: 0.3,
        scale: 0.9,
        y: 20
      });

      gsap.set(progressLineRef.current, {
        scaleX: 0,
        transformOrigin: "left center"
      });

      gsap.set(progressDotRef.current, {
        x: 0
      });

      // Create timeline for the animation sequence
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const currentStep = Math.floor(progress * 4);
            
            // Update progress line
            gsap.to(progressLineRef.current, {
              scaleX: progress,
              duration: 0.3,
              ease: "power2.out"
            });

            // Update progress dot position
            gsap.to(progressDotRef.current, {
              x: progress * 100 + "%",
              duration: 0.3,
              ease: "power2.out"
            });

            // Animate steps
            stepsRef.current.forEach((step, index) => {
              if (index <= currentStep) {
                gsap.to(step, {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "back.out(1.7)"
                });
                
                // Add pulse effect to current step
                if (index === currentStep) {
                  gsap.to(step.querySelector('.step-circle'), {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                } else {
                  gsap.to(step.querySelector('.step-circle'), {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }
              } else {
                gsap.to(step, {
                  opacity: 0.3,
                  scale: 0.9,
                  y: 20,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }
            });
          }
        }
      });

      // Auto-play animation on first view
      const autoPlayTl = gsap.timeline({ delay: 0.5 });
      
      steps.forEach((_, index) => {
        autoPlayTl.to({}, {
          duration: 1,
          onStart: () => {
            // Highlight current step
            stepsRef.current.forEach((step, stepIndex) => {
              if (stepIndex <= index) {
                gsap.to(step, {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "back.out(1.7)"
                });
              }
            });
            
            // Update progress
            gsap.to(progressLineRef.current, {
              scaleX: (index + 1) / 4,
              duration: 0.8,
              ease: "power2.out"
            });
            
            gsap.to(progressDotRef.current, {
              x: ((index + 1) / 4) * 100 + "%",
              duration: 0.8,
              ease: "power2.out"
            });
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 py-20 md:px-10 bg-[var(--bg-elev)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="h2 mb-4">How it works</h2>
          <p className="body text-fg-muted max-w-2xl mx-auto">
            Follow our simple 4-step process to generate professional marketing content
          </p>
        </div>
        
        {/* Progress Line */}
        <div className="relative mb-12 hidden md:block">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/30 -translate-y-1/2"></div>
          <div 
            ref={progressLineRef}
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] -translate-y-1/2 rounded-full shadow-lg"
            style={{ width: '100%' }}
          ></div>
          <div 
            ref={progressDotRef}
            className="absolute top-1/2 w-4 h-4 bg-[var(--accent)] rounded-full -translate-y-1/2 -translate-x-1/2 shadow-lg border-2 border-white"
            style={{ left: '0%' }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => {
                if (el) stepsRef.current[index] = el;
              }}
              className="text-center relative"
            >
              {/* Step Circle */}
              <div className="step-circle w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg relative overflow-hidden">
                <span className="relative z-10">{step.number}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              
              {/* Step Icon */}
              <div className="text-3xl mb-3">{step.icon}</div>
              
              {/* Step Content */}
              <h3 className="font-semibold mb-2 text-lg">{step.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {step.description}
              </p>
              
              {/* Connection Line (Mobile) */}
              {index < steps.length - 1 && (
                <div className="md:hidden absolute -bottom-4 left-1/2 w-px h-8 bg-border/50 -translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/forms">
            <Button size="lg" className="group">
              Open the form hub
              <svg 
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
