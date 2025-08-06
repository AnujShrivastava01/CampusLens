import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Layers, Menu } from "lucide-react";
import { useLenisSmoothScroll } from "@/hooks/useLenisSmoothScroll";
import { useLocation } from "react-router-dom";

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  { id: "hero", label: "Home", icon: <Home className="h-4 w-4" /> },
  { id: "features", label: "Features", icon: <Layers className="h-4 w-4" /> },
];

const LenisSectionNavigator = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isOpen, setIsOpen] = useState(false);
  const { scrollToSection, lenis, isReady } = useLenisSmoothScroll();
  const location = useLocation();

  useEffect(() => {
    if (!lenis || !isReady || location.pathname !== "/") return;

    const handleScroll = () => {
      const scrollTop = lenis.scroll;
      const windowHeight = window.innerHeight;
      
      // Determine which section is currently in view
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = scrollTop + rect.top;
          const elementBottom = elementTop + element.offsetHeight;
          
          // If the section is in the viewport (with some offset)
          if (scrollTop >= elementTop - windowHeight / 3 && scrollTop < elementBottom - windowHeight / 3) {
            setActiveSection(section.id);
          }
        }
      });
    };

    lenis.on('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, isReady, location.pathname]);

  // Only show on the home page
  if (location.pathname !== "/") return null;

  const handleSectionClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col items-center space-y-2">
        {/* Navigation dots */}
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
              activeSection === section.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-125"
                : "bg-gray-400 dark:bg-gray-600 hover:bg-blue-500"
            }`}
            title={section.label}
            aria-label={`Navigate to ${section.label}`}
          />
        ))}
      </div>
      
      {/* Mobile/Touch-friendly version */}
      <div className="lg:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg"
          size="icon"
          variant="ghost"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div className="fixed left-16 top-1/2 transform -translate-y-1/2 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                variant={activeSection === section.id ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start mb-1 last:mb-0"
              >
                {section.icon}
                <span className="ml-2">{section.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LenisSectionNavigator;
