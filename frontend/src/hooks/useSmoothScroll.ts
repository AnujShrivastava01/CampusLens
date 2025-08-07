import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    // Initialize Lenis with mobile-optimized settings
    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.2, // Faster duration on mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      wrapper: window,
      content: document.documentElement,
      // Enable touch on mobile and allow overscroll for pull-to-refresh
      touchMultiplier: isMobile ? 2 : 1,
      infinite: false,
      // Allow overscroll behavior on mobile for pull-to-refresh
      overscroll: isMobile,
      // Prevent Lenis from interfering with pull-to-refresh
      prevent: (node) => {
        // Don't prevent scrolling on mobile to allow pull-to-refresh
        if (isMobile && window.scrollY === 0) {
          return false;
        }
        return node.classList.contains('lenis-prevent') || node.hasAttribute('data-lenis-prevent');
      },
    });

    lenisRef.current = lenis;

    // Get scroll value
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // Update ScrollTrigger
      ScrollTrigger.update();
    });

    // Use requestAnimationFrame to continuously update the scroll
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis with GSAP ScrollTrigger
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Refresh ScrollTrigger when Lenis updates
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      ScrollTrigger.killAll();
    };
  }, []);

  // Return methods to control scrolling
  return {
    scrollTo: (target: string | number, options?: Record<string, unknown>) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      }
    },
    start: () => {
      if (lenisRef.current) {
        lenisRef.current.start();
      }
    },
    stop: () => {
      if (lenisRef.current) {
        lenisRef.current.stop();
      }
    },
    lenis: lenisRef.current,
  };
};
