import { createContext, useContext, useEffect, useRef, ReactNode, useState } from 'react';
import Lenis from '@studio-freight/lenis';

interface LenisSmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number, options?: Record<string, unknown>) => void;
  scrollToTop: () => void;
  scrollToSection: (sectionId: string) => void;
  isReady: boolean;
}

const LenisSmoothScrollContext = createContext<LenisSmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  scrollToTop: () => {},
  scrollToSection: () => {},
  isReady: false,
});

export const useLenisSmoothScroll = () => useContext(LenisSmoothScrollContext);

interface LenisSmoothScrollProviderProps {
  children: ReactNode;
}

export const LenisSmoothScrollProvider = ({ children }: LenisSmoothScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure DOM is fully loaded
    const initTimer = setTimeout(() => {
      try {
        // Initialize Lenis with minimal settings
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          infinite: false,
        });

        lenisRef.current = lenis;

        // Add Lenis class to HTML for CSS optimization
        document.documentElement.classList.add('lenis');

        // RAF loop with error handling
        function raf(time: number) {
          try {
            if (lenisRef.current) {
              lenisRef.current.raf(time);
            }
            rafRef.current = requestAnimationFrame(raf);
          } catch (error) {
            console.warn('Lenis RAF error:', error);
            // Fallback to next frame
            rafRef.current = requestAnimationFrame(raf);
          }
        }
        
        rafRef.current = requestAnimationFrame(raf);

        // Handle resize
        const handleResize = () => {
          if (lenisRef.current) {
            lenisRef.current.resize();
          }
        };
        
        window.addEventListener('resize', handleResize);
        
        // Mark as ready after initialization
        setIsReady(true);
        
        return () => {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
          }
          window.removeEventListener('resize', handleResize);
          document.documentElement.classList.remove('lenis');
          if (lenisRef.current) {
            lenisRef.current.destroy();
          }
          setIsReady(false);
        };
      } catch (error) {
        console.warn('Lenis initialization failed:', error);
        setIsReady(false);
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
    };
  }, []);

  const scrollTo = (target: string | number, options?: Record<string, unknown>) => {
    if (lenisRef.current && isReady) {
      try {
        lenisRef.current.scrollTo(target, {
          duration: 1.0,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          immediate: false,
          ...options,
        });
      } catch (error) {
        console.warn('Lenis scrollTo error:', error);
        // Fallback to native scroll
        if (typeof target === 'string') {
          const element = document.querySelector(target);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: target, behavior: 'smooth' });
        }
      }
    }
  };

  const scrollToTop = () => {
    scrollTo(0);
  };

  const scrollToSection = (sectionId: string) => {
    scrollTo(`#${sectionId}`);
  };

  return (
    <LenisSmoothScrollContext.Provider 
      value={{ 
        lenis: lenisRef.current, 
        scrollTo,
        scrollToTop,
        scrollToSection,
        isReady
      }}
    >
      {children}
    </LenisSmoothScrollContext.Provider>
  );
};
