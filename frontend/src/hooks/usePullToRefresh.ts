import { useEffect, useCallback } from 'react';

interface PullToRefreshOptions {
  onRefresh?: () => void | Promise<void>;
  threshold?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  enabled = true,
}: PullToRefreshOptions = {}) => {
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      }
    }
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled || !onRefresh) return;

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;

    if (!isMobile) return;

    let startY = 0;
    let isRefreshing = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing && startY > 0) {
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;

        if (pullDistance > threshold) {
          // Add visual feedback here if needed
          document.body.style.transform = `translateY(${Math.min(pullDistance / 3, 30)}px)`;
          document.body.style.transition = 'none';
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing && startY > 0) {
        const endY = e.changedTouches[0].clientY;
        const pullDistance = endY - startY;

        // Reset visual feedback
        document.body.style.transform = '';
        document.body.style.transition = '';

        if (pullDistance > threshold) {
          isRefreshing = true;
          handleRefresh().finally(() => {
            isRefreshing = false;
            startY = 0;
          });
        }
      }
      startY = 0;
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // Reset any lingering styles
      document.body.style.transform = '';
      document.body.style.transition = '';
    };
  }, [handleRefresh, threshold, enabled, onRefresh]);

  return { handleRefresh };
};
