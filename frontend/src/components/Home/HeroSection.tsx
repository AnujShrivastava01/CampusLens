import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Upload, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/clerk-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
      {/* Excel Sheet Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      
      {/* Excel Grid Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        {/* Vertical Grid Lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 79px,
            #e2e8f0 79px,
            #e2e8f0 80px
          )`
        }}></div>
        {/* Horizontal Grid Lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 24px,
            #e2e8f0 24px,
            #e2e8f0 25px
          )`
        }}></div>
      </div>
      
      {/* Excel Header Row */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-200 dark:bg-slate-700 border-b border-slate-300 dark:border-slate-600 opacity-40"></div>
      
      {/* Excel Column Headers */}
      <div className="absolute top-8 left-0 right-0 h-6 opacity-30">
        <div className="flex text-xs text-slate-600 dark:text-slate-400 font-medium">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'].map((letter, index) => (
            <div key={letter} className="w-20 text-center border-r border-slate-300 dark:border-slate-600 py-1">
              {letter}
            </div>
          ))}
        </div>
      </div>
      
      {/* Excel Row Numbers */}
      <div className="absolute top-14 left-0 bottom-0 w-12 opacity-30">
        <div className="flex flex-col text-xs text-slate-600 dark:text-slate-400 font-medium">
          {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
            <div key={num} className="h-6 text-center border-b border-slate-300 dark:border-slate-600 flex items-center justify-center">
              {num}
            </div>
          ))}
        </div>
      </div>
      
      {/* Subtle Data Cells with Sample Content */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-20 left-20 w-16 h-5 bg-primary/20 rounded-sm"></div>
        <div className="absolute top-32 left-40 w-24 h-5 bg-accent/20 rounded-sm"></div>
        <div className="absolute top-44 left-60 w-20 h-5 bg-primary/15 rounded-sm"></div>
        <div className="absolute top-56 left-32 w-28 h-5 bg-accent/15 rounded-sm"></div>
        <div className="absolute top-68 left-80 w-18 h-5 bg-primary/10 rounded-sm"></div>
        <div className="absolute bottom-40 right-40 w-22 h-5 bg-accent/10 rounded-sm"></div>
        <div className="absolute bottom-60 right-60 w-26 h-5 bg-primary/12 rounded-sm"></div>
      </div>
      
      {/* Gradient Overlay for Content Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-transparent dark:via-slate-900/60"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto -mt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Badge */}
          <motion.div 
            variants={itemVariants} 
            className="mb-10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="inline-flex items-center space-x-3 glass-card text-sm text-muted-foreground px-6 py-3 border border-primary/20 shadow-lg">
              <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse shadow-lg"></div>
              <span className="font-medium">Student Data Management Made Simple</span>
              <div className="w-1 h-1 bg-accent rounded-full animate-ping"></div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent drop-shadow-2xl">
              Campus
            </span>
            <span className="text-foreground drop-shadow-lg">Lens</span>
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-full opacity-30"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light relative"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Upload, manage, and analyze student data with powerful Excel integration
            and real-time filtering capabilities.
            {/* Subtle highlight effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg -z-10 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-0"
          >
            {isSignedIn ? (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="group text-lg px-8 py-4 h-auto shadow-2xl border border-primary/20 relative overflow-hidden rounded-xl"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-3 h-6 w-6 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 relative z-10" />
                </Button>
              </motion.div>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button
                    variant="hero"
                    size="lg"
                    className="group text-lg px-8 py-4 h-auto shadow-2xl border border-primary/20 relative overflow-hidden rounded-xl"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 relative z-10" />
                  </Button>
                </motion.div>
              </SignInButton>
            )}
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full"
            animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-3 h-3 bg-accent/40 rounded-full"
            animate={{ y: [10, -10, 10], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary-glow/50 rounded-full"
            animate={{ y: [-5, 15, -5], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;