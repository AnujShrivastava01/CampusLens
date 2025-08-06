import React, { createContext, useContext, ReactNode } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

interface SmoothScrollContextType {
  scrollTo: (target: string | number, options?: Record<string, unknown>) => void;
  start: () => void;
  stop: () => void;
  lenis: unknown;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const smoothScroll = useSmoothScroll();

  return (
    <SmoothScrollContext.Provider value={smoothScroll}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export const useSmoothScrollContext = () => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScrollContext must be used within a SmoothScrollProvider');
  }
  return context;
};
