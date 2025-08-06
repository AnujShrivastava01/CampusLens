/**
 * Mobile scroll optimization utilities
 * Helps prevent scroll sticking issues on mobile devices
 */

export const isMobileDevice = (): boolean => {
  // Multiple checks for comprehensive mobile detection
  const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth < 768;
  const hasTouchScreen = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
  const isMobileBrowser = /Mobi|Android/i.test(navigator.userAgent);
  
  return userAgent || isSmallScreen || hasTouchScreen || isMobileViewport || isMobileBrowser;
};

export const fixMobileScrollSticking = (): void => {
  if (!isMobileDevice()) return;
  
  // Remove any conflicting Lenis classes
  document.documentElement.classList.remove('lenis');
  
  // Apply mobile-optimized styles
  const style = document.createElement('style');
  style.textContent = `
    /* Mobile scroll fix */
    @media (max-width: 767px) {
      html, body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior-y: auto !important;
        height: auto !important;
        transform: none !important;
        position: static !important;
      }
      
      /* Prevent scroll sticking on fixed elements */
      .fixed, [style*="position: fixed"] {
        transform: translateZ(0) !important;
      }
    }
  `;
  
  // Add style to head if not already present
  if (!document.querySelector('#mobile-scroll-fix')) {
    style.id = 'mobile-scroll-fix';
    document.head.appendChild(style);
  }
};

export const smoothScrollToElement = (element: Element | string, behavior: ScrollBehavior = 'smooth'): void => {
  const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
  
  if (!targetElement) return;
  
  if (isMobileDevice()) {
    // Use enhanced native scrolling for mobile
    requestAnimationFrame(() => {
      targetElement.scrollIntoView({
        behavior,
        block: 'start',
        inline: 'nearest'
      });
    });
  } else {
    // Standard scrolling for desktop
    targetElement.scrollIntoView({
      behavior,
      block: 'start'
    });
  }
};

export const smoothScrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  if (isMobileDevice()) {
    // Use requestAnimationFrame for smoother mobile scrolling
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior
    });
  }
};

// Initialize mobile scroll fixes on load
export const initMobileScrollFixes = (): void => {
  if (typeof window === 'undefined') return;
  
  if (isMobileDevice()) {
    fixMobileScrollSticking();
    
    // Add passive touch event listeners to prevent interference
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    document.addEventListener('touchend', () => {}, { passive: true });
    
    // Fix any scroll sticking on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(fixMobileScrollSticking, 100);
    });
    
    // Fix any scroll sticking on resize
    window.addEventListener('resize', () => {
      if (isMobileDevice()) {
        setTimeout(fixMobileScrollSticking, 100);
      }
    });
  }
};
