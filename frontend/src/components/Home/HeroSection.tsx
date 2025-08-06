import { Button } from "@/components/ui/button";
import { ArrowRight, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden -mt-20 pt-20">
      {/* Background Image - Starts from very top */}
      <div 
        className="absolute inset-0 -top-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.png)',
          opacity: isVisible ? 1 : 0.7,
          transform: isVisible ? 'scale(1)' : 'scale(1.05)',
          transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      ></div>
      
      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 -top-20 bg-black/20 dark:bg-black/40"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        }}
      ></div>
      
      {/* Main Content Container */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto text-center">
        
        {/* Hero Badge */}
        <div 
          className="mb-8 inline-flex items-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 shadow-lg"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
          }}
        >
          <div className="flex items-center space-x-3">
           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-700 dark:text-slate-300 ml-3 font-medium">Student Data Management Made Simple</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg leading-tight"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
          }}
        >
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Campus</span>
          <span className="text-white">Lens</span>
        </h1>

        {/* Description */}
        <div 
          className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s',
          }}
        >
          Upload, manage, and analyze student data with powerful Excel integration and real-time filtering capabilities.
        </div>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1) 1.1s',
          }}
        >
          {isSignedIn ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                onClick={() => navigate("/files")}
                variant="outline"
                size="lg"
                className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                View Files
                <Database className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
          )}
        </div>

        {/* Decorative Gradient Elements */}
        <div 
          className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-3xl"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translate(0, 0) scale(1)' : 'translate(-20px, -20px) scale(0.8)',
            transition: 'all 3s cubic-bezier(0.16, 1, 0.3, 1) 1.5s',
          }}
        ></div>
        <div 
          className="absolute top-1/2 -left-40 w-48 h-48 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translate(0, 0) scale(1)' : 'translate(-30px, 0) scale(0.9)',
            transition: 'all 3s cubic-bezier(0.16, 1, 0.3, 1) 1.9s',
          }}
        ></div>
        <div 
          className="absolute top-1/4 -right-40 w-48 h-48 bg-gradient-to-r from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translate(0, 0) scale(1)' : 'translate(30px, -10px) scale(0.9)',
            transition: 'all 3s cubic-bezier(0.16, 1, 0.3, 1) 2.1s',
          }}
        ></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
