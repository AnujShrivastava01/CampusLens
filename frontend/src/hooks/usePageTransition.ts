import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UsePageTransitionReturn {
  isTransitioning: boolean;
  isExiting: boolean;
  isNavigatingToHome: boolean;
  isNavigatingFromHome: boolean;
  transitionProgress: number;
}

export const usePageTransition = (): UsePageTransitionReturn => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const previousLocation = useRef(location.pathname);

  const isNavigatingToHome = location.pathname === '/';
  const isNavigatingFromHome = previousLocation.current === '/';

  useEffect(() => {
    // Reset transition states
    setTransitionProgress(0);
    setIsExiting(true);
    
    // Animate transition progress
    const progressInterval = setInterval(() => {
      setTransitionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 10);
    
    // Start exit transition
    const exitTimer = setTimeout(() => {
      setIsTransitioning(true);
      setIsExiting(false);
    }, isNavigatingToHome ? 200 : 150);
    
    // Complete transition
    const entryTimer = setTimeout(() => {
      setIsTransitioning(false);
      previousLocation.current = location.pathname;
      setTransitionProgress(100);
    }, isNavigatingToHome ? 300 : 200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(entryTimer);
      clearInterval(progressInterval);
    };
  }, [location.pathname, isNavigatingToHome]);

  return {
    isTransitioning,
    isExiting,
    isNavigatingToHome,
    isNavigatingFromHome,
    transitionProgress,
  };
};

export default usePageTransition;
