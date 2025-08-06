import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useSmoothScrolling } from "@/hooks/useSmoothScrolling";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollToTop } = useSmoothScrolling();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      const scrollTop = lenis.scroll;
      setIsVisible(scrollTop > 300); // Show button after scrolling 300px
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

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

export default BackToTopButton;
