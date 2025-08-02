import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import FileView from "./pages/FileView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Replace with your actual Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your-key-here';

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/files" element={<Files />} />
              <Route path="/files/:fileId" element={<FileView />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
