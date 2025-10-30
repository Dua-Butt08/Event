"use client";

import { useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollAnimations() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = currentScrollY / maxScroll;
    
    setScrollY(currentScrollY);
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const animateOnScroll = useCallback((selector: string, options: gsap.TweenVars) => {
    const scrollTriggerOptions = options.scrollTrigger || {};
    return gsap.to(selector, {
      scrollTrigger: {
        trigger: selector,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        ...scrollTriggerOptions
      },
      ...options
    });
  }, []);

  const createScrollTimeline = useCallback(() => {
    return gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });
  }, []);

  return {
    scrollY,
    scrollProgress,
    animateOnScroll,
    createScrollTimeline
  };
}