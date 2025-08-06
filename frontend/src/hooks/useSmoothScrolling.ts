import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

export const useSmoothScrolling = () => {
  const { scrollTo, lenis } = useSmoothScroll();

  const scrollToTop = () => {
    scrollTo(0);
  };

  const scrollToBottom = () => {
    scrollTo(document.body.scrollHeight);
  };

  const scrollToSection = (sectionId: string) => {
    scrollTo(`#${sectionId}`);
  };

  const scrollToElement = (element: HTMLElement | string) => {
    if (typeof element === "string") {
      scrollTo(element);
    } else {
      // For HTMLElement, we'll scroll to its position
      const rect = element.getBoundingClientRect();
      const currentScroll = lenis?.scroll || window.scrollY;
      scrollTo(currentScroll + rect.top);
    }
  };

  const scrollBy = (offset: number) => {
    if (lenis) {
      const currentScroll = lenis.scroll;
      scrollTo(currentScroll + offset);
    }
  };

  return {
    scrollToTop,
    scrollToBottom,
    scrollToSection,
    scrollToElement,
    scrollBy,
    scrollTo,
    lenis,
  };
};
