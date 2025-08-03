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
    
    // End transition after a brief moment
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      className="page-wrapper"
      style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};
