import Layout from "@/components/Layout/Layout";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <HeroSection />
        </AnimatedSection>
        
        <AnimatedSection animation="fadeInUp" delay={0.4} threshold={0.2}>
          <FeaturesSection />
        </AnimatedSection>
      </Layout>
    </div>
  );
};

export default Index;