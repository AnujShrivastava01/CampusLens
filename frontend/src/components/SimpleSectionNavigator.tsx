import { useState } from "react";
import { useLenisSmoothScroll } from "@/contexts/LenisSmoothScrollContext";
import { useLocation } from "react-router-dom";

const SimpleSectionNavigator = () => {
  const { scrollToSection } = useLenisSmoothScroll();
  const location = useLocation();

  // Only show on the home page
  if (location.pathname !== "/") return null;

  const sections = [
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
  ];

  const handleSectionClick = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col items-center space-y-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 hover:bg-blue-500 transition-all duration-300 hover:scale-125"
            title={section.label}
            aria-label={`Navigate to ${section.label}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleSectionNavigator;
