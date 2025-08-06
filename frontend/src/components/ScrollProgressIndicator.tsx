import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

const ScrollProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!lenis) return;

    const updateProgress = () => {
      const scrollTop = lenis.scroll;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    lenis.on("scroll", updateProgress);
    updateProgress(); // Initial call

    return () => {
      lenis.off("scroll", updateProgress);
    };
  }, [lenis]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[10000] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: scrollProgress > 0 ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
        }}
      />
    </div>
  );
};

export default ScrollProgressIndicator;
