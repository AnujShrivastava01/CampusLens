import { Button } from "@/components/ui/button";
import { ArrowRight, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/clerk-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  return (
    <section className="h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Clean Excel Sheet Background */}
      <div className="absolute inset-0 bg-white dark:bg-slate-900"></div>
      
      {/* Excel Grid Background - Smaller Cells */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #d1d5db 1px, transparent 1px),
              linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: '80px 32px'
          }}
        ></div>
      </div>

      {/* Excel Column Headers - Adjusted for smaller cells */}
      <div className="absolute top-16 left-16 flex space-x-20 text-sm text-slate-500 dark:text-slate-500 font-mono z-0">
        <span className="w-20 text-center">A</span>
        <span className="w-20 text-center">B</span>
        <span className="w-20 text-center">C</span>
        <span className="w-20 text-center">D</span>
        <span className="w-20 text-center">E</span>
        <span className="w-20 text-center">F</span>
        <span className="w-20 text-center">G</span>
        <span className="w-20 text-center">H</span>
        <span className="w-20 text-center">I</span>
        <span className="w-20 text-center">J</span>
        <span className="w-20 text-center">K</span>
        <span className="w-20 text-center">L</span>
        <span className="w-20 text-center">M</span>
        <span className="w-20 text-center">N</span>
      </div>
      
      {/* Excel Row Numbers */}
      <div className="absolute top-20 left-8 flex flex-col space-y-2 text-sm text-slate-500 dark:text-slate-500 font-mono z-0">
        <span className="h-8 flex items-center w-6 text-center">1</span>
        <span className="h-8 flex items-center w-6 text-center">2</span>
        <span className="h-8 flex items-center w-6 text-center">3</span>
        <span className="h-8 flex items-center w-6 text-center">4</span>
        <span className="h-8 flex items-center w-6 text-center">5</span>
        <span className="h-8 flex items-center w-6 text-center">6</span>
        <span className="h-8 flex items-center w-6 text-center">7</span>
        <span className="h-8 flex items-center w-6 text-center">8</span>
        <span className="h-8 flex items-center w-6 text-center">9</span>
        <span className="h-8 flex items-center w-6 text-center">10</span>
        <span className="h-8 flex items-center w-6 text-center">11</span>
        <span className="h-8 flex items-center w-6 text-center">12</span>
        <span className="h-8 flex items-center w-6 text-center">13</span>
        <span className="h-8 flex items-center w-6 text-center">14</span>
        <span className="h-8 flex items-center w-6 text-center">15</span>
        <span className="h-8 flex items-center w-6 text-center">16</span>
        <span className="h-8 flex items-center w-6 text-center">17</span>
        <span className="h-8 flex items-center w-6 text-center">18</span>
      </div>

      {/* Subtle Decorative Elements */}
      <div className="absolute top-32 right-16 w-20 h-6 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800/30 flex items-center justify-center text-xs opacity-40">Analytics</div>
      <div className="absolute bottom-40 left-32 w-16 h-6 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800/30 flex items-center justify-center text-xs opacity-40">Data</div>
      <div className="absolute bottom-56 right-40 w-18 h-6 bg-purple-50 dark:bg-purple-950/20 rounded border border-purple-200 dark:border-purple-800/30 flex items-center justify-center text-xs opacity-40">Excel</div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        
        {/* Excel-style Header */}
        <div className="mb-8 inline-flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-700 dark:text-slate-300 ml-3 font-medium">Student Data Management Made Simple</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Campus</span>
          <span className="text-slate-900 dark:text-white">Lens</span>
        </h1>

        {/* Description */}
        <div className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Upload, manage, and analyze student data with powerful Excel integration and real-time filtering capabilities.
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {isSignedIn ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                onClick={() => navigate("/files")}
                variant="outline"
                size="lg"
                className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                View Files
                <Database className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
          )}
        </div>

        {/* Decorative Excel Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default HeroSection;
