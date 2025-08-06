import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useLenisSmoothScroll } from "@/hooks/useLenisSmoothScroll";

const LenisBackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollToTop, lenis, isReady } = useLenisSmoothScroll();

  useEffect(() => {
    if (!lenis || !isReady) {
      // Fallback to regular scroll listener
      const handleScroll = () => {
        setIsVisible(window.scrollY > 300);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const handleScroll = () => {
      setIsVisible(lenis.scroll > 300);
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, isReady]);

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      size="icon"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

export default LenisBackToTopButton;
