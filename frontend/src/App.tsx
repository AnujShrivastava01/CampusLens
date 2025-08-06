import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/clerk-react";
import { PageTransition } from "@/components/PageTransition";
import { Preloader } from "@/components/Preloader";
import { LenisSmoothScrollProvider } from "@/contexts/LenisSmoothScrollContext";
import LenisBackToTopButton from "@/components/LenisBackToTopButton";
import Navbar from "@/components/Layout/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Files from "./pages/Files";
import FileView from "./pages/FileView";
import Developer from "./pages/Developer";
import NotFound from "./pages/NotFound";
import "@/styles/transitions.css";
import { useState, useEffect } from "react";
import { initMobileScrollFixes } from "@/utils/mobileScrollFix";

const queryClient = new QueryClient();

// Replace with your actual Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your-key-here';

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  // Initialize mobile scroll fixes
  useEffect(() => {
    initMobileScrollFixes();
  }, []);

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <LenisSmoothScrollProvider>
              <LenisBackToTopButton />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Navbar />
                <Routes>
                <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/students" element={<PageTransition><Students /></PageTransition>} />
                <Route path="/files" element={<PageTransition><Files /></PageTransition>} />
                <Route path="/files/:fileId" element={<PageTransition><FileView /></PageTransition>} />
                <Route path="/developer" element={<PageTransition><Developer /></PageTransition>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </BrowserRouter>
            </LenisSmoothScrollProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
