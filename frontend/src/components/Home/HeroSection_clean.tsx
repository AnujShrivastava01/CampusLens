import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Upload, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/clerk-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
      {/* Excel Sheet Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        
        {/* Excel-style Header */}
        <div className="mb-8 inline-flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400 ml-3">CampusLens.xlsx</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
          Transform Your
          <span className="inline-block mx-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg transform -rotate-1">
            Campus Data
          </span>
          <span className="inline-block mx-4 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg transform rotate-1">
            Management
          </span>
        </h1>

        {/* Description */}
        <div className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Upload, analyze, and visualize your campus data with powerful Excel-like capabilities.
          <span className="inline-block mx-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-md text-base font-medium">
            No technical expertise required
          </span>
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

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <Upload className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Easy Upload</h3>
            <p className="text-slate-600 dark:text-slate-300">Drag and drop your Excel files or CSV data instantly</p>
          </div>
          
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <Search className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Smart Analysis</h3>
            <p className="text-slate-600 dark:text-slate-300">Filter, search, and analyze your data with advanced tools</p>
          </div>
          
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <Database className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Secure Storage</h3>
            <p className="text-slate-600 dark:text-slate-300">Your data is encrypted and securely stored in the cloud</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </section>
  );
};

export default HeroSection;
