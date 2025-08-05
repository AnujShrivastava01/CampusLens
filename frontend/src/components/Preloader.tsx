import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = [
    'Initializing CampusLens...',
    'Loading Resources...',
    'Preparing Dashboard...',
    'Almost Ready...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          setTimeout(() => onComplete(), 700);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(stepTimer);
  }, [loadingSteps.length]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/80 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(239, 246, 255, 0.8) 20%, 
                rgba(224, 242, 254, 0.85) 40%, 
                rgba(199, 210, 254, 0.75) 60%, 
                rgba(165, 180, 252, 0.8) 80%, 
                rgba(129, 140, 248, 0.7) 100%
              )
            `
          }}
        >
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            {/* Main gradient orbs - lighter and more subtle */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Additional floating orbs - more subtle */}
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-300/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-300/10 to-purple-400/10 rounded-full blur-2xl animate-pulse delay-700"></div>
            
            {/* Additional soft light orbs */}
            <div className="absolute top-10 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-200/10 to-cyan-300/10 rounded-full blur-xl animate-pulse delay-300"></div>
            <div className="absolute bottom-10 right-1/2 w-40 h-40 bg-gradient-to-r from-purple-200/10 to-pink-300/10 rounded-full blur-xl animate-pulse delay-800"></div>
            
            {/* Geometric shapes - lighter */}
            <div className="absolute top-20 right-20 w-32 h-32 border border-blue-200/15 rounded-lg rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 border border-purple-200/15 rounded-full animate-bounce-slow"></div>
            
            {/* Soft gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-blue-100/10"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-50/5 to-purple-100/10"></div>
            
            {/* Subtle grid pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.2) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
            ></div>
          </div>

          <div className="relative z-10 text-center px-8">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <div className="relative">
                <motion.img
                  src="/logo1.png"
                  alt="CampusLens"
                  className="w-24 h-24 mx-auto drop-shadow-2xl"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 w-24 h-24 mx-auto bg-blue-500/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-bold mb-2"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Campus
              </span>
              <span className="text-slate-800 dark:text-white">Lens</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-600 dark:text-slate-300 mb-8 text-lg"
            >
              Student Data Management Made Simple
            </motion.p>

            {/* Developer Credit */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-600/50 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    Crafted by{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                      Anuj
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Progress Bar Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md mx-auto"
            >
              {/* Progress Bar Background */}
              <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                {/* Progress Bar Fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </motion.div>
              </div>

              {/* Progress Percentage */}
              <motion.div
                className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400 mb-2"
              >
                <span>{progress}%</span>
                <span>Loading...</span>
              </motion.div>

              {/* Loading Step Text */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  {loadingSteps[currentStep]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center space-x-2 mt-8"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
