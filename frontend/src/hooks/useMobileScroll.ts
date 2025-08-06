import { useEffect, useCallback } from 'react';
import { isMobileDevice, smoothScrollToElement, smoothScrollToTop } from '@/utils/mobileScrollFix';

/**
 * Custom hook for handling scroll behavior with mobile optimization
 */
export const useMobileOptimizedScroll = () => {
  const scrollToElement = useCallback((selector: string | Element, behavior: ScrollBehavior = 'smooth') => {
    smoothScrollToElement(selector, behavior);
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    smoothScrollToTop(behavior);
  }, []);

  const scrollToSection = useCallback((sectionId: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(sectionId);
    if (element) {
      smoothScrollToElement(element, behavior);
    }
  }, []);

  const isOnMobile = useCallback(() => {
    return isMobileDevice();
  }, []);

  // Prevent scroll sticking on mobile by ensuring proper touch handling
  useEffect(() => {
    if (!isMobileDevice()) return;

    const preventScrollSticking = () => {
      // Ensure body has proper mobile scroll properties
      document.body.style.touchAction = 'pan-y';
      document.body.style.overflow = 'auto';
      // Safely set webkit overflow scrolling for iOS
      const bodyStyle = document.body.style as CSSStyleDeclaration & {
        webkitOverflowScrolling?: string;
      };
      bodyStyle.webkitOverflowScrolling = 'touch';
    };

    preventScrollSticking();

    // Re-apply on orientation change (common cause of scroll sticking)
    const handleOrientationChange = () => {
      setTimeout(preventScrollSticking, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', preventScrollSticking);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', preventScrollSticking);
    };
  }, []);

  return {
    scrollToElement,
    scrollToTop,
    scrollToSection,
    isOnMobile,
  };
};

/**
 * Hook to fix scroll sticking issues on specific components
 */
export const useScrollStickingFix = () => {
  useEffect(() => {
    if (!isMobileDevice()) return;

    // Add passive event listeners to improve scroll performance
    const options = { passive: true };
    
    const handleTouchStart = () => {};
    const handleTouchMove = () => {};
    const handleTouchEnd = () => {};

    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
};
