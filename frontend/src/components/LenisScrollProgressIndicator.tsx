import { useEffect, useState } from "react";
import { useLenisSmoothScroll } from "@/hooks/useLenisSmoothScroll";

const LenisScrollProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { lenis, isReady } = useLenisSmoothScroll();

  useEffect(() => {
    if (!lenis || !isReady) {
      // Fallback to regular scroll listener
      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      };

      const handleScroll = () => {
        requestAnimationFrame(updateProgress);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      updateProgress();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    const updateProgress = () => {
      const scrollTop = lenis.scroll;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    lenis.on('scroll', updateProgress);
    updateProgress(); // Initial call

    return () => {
      lenis.off('scroll', updateProgress);
    };
  }, [lenis, isReady]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[10000] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: scrollProgress > 0 ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
        }}
      />
    </div>
  );
};

export default LenisScrollProgressIndicator;
