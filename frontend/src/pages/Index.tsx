import Layout from "@/components/Layout/Layout";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import { useEffect } from "react";

const Index = () => {
  // Scroll to top when landing page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
    </Layout>
  );
};

export default Index;