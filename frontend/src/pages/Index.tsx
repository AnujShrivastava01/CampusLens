import Layout from "@/components/Layout/Layout";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Immediately scroll to top when landing page loads
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Trigger entrance animation after a brief delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="home-page-wrapper"
      style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Layout>
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          <HeroSection />
        </div>
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(60px)',
            transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          <FeaturesSection />
        </div>
      </Layout>
    </div>
  );
};

export default Index;