import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number, options?: any) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize Lenis with minimal, optimized configuration
    const lenis = new Lenis({
      duration: 1.2, // Slower, more relaxed scrolling
      easing: (t: number) => {
        // Premium smooth easing - exponential out
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      },
      infinite: false,
    });

    lenisRef.current = lenis;

    // High-performance animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Add resize listener for better responsiveness
    const handleResize = () => lenis.resize();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
    };
  }, []);

  const scrollTo = (target: string | number, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 1.0, // Slower scroll duration for smooth feel
        easing: (t: number) => 1 - Math.pow(1 - t, 3), // Gentle easing
        immediate: false,
        ...options,
      });
    }
  };

  return (
    <SmoothScrollContext.Provider 
      value={{ 
        lenis: lenisRef.current, 
        scrollTo 
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
};
