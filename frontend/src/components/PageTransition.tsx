import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    
    // End transition after a longer moment for smoother effect
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      className="page-wrapper"
      style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning 
          ? 'translateY(25px)' 
          : 'translateY(0px)',
        filter: isTransitioning ? 'blur(6px)' : 'blur(0px)',
        transition: 'all 2.2s cubic-bezier(0.16, 1, 0.3, 1)',
        minHeight: '100vh',
        width: '100%',
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
};
