import Layout from "@/components/Layout/Layout";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import { useEffect } from "react";

const Index = () => {
  // Immediately scroll to top when landing page loads (no smooth animation for navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
    </Layout>
  );
};

export default Index;