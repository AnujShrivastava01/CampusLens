import { createContext, useContext, ReactNode } from 'react';

interface SimpleSmoothScrollContextType {
  scrollTo: (target: string | number) => void;
  scrollToTop: () => void;
  scrollToSection: (sectionId: string) => void;
}

const SimpleSmoothScrollContext = createContext<SimpleSmoothScrollContextType>({
  scrollTo: () => {},
  scrollToTop: () => {},
  scrollToSection: () => {},
});

export const useSimpleSmoothScroll = () => useContext(SimpleSmoothScrollContext);

interface SimpleSmoothScrollProviderProps {
  children: ReactNode;
}

export const SimpleSmoothScrollProvider = ({ children }: SimpleSmoothScrollProviderProps) => {
  const scrollTo = (target: string | number) => {
    if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      });
    } else if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <SimpleSmoothScrollContext.Provider 
      value={{ 
        scrollTo,
        scrollToTop,
        scrollToSection
      }}
    >
      {children}
    </SimpleSmoothScrollContext.Provider>
  );
};
