import { motion } from "framer-motion";
import { Github, Linkedin, ExternalLink, Heart, Sparkles, Code, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout/Layout";
import { useState, useEffect } from "react";

const Developer = () => {
  const [isImageRevealed, setIsImageRevealed] = useState(false);

  const handleImageClick = () => {
    setIsImageRevealed(!isImageRevealed);
  };

  // Auto-hide image after 5 seconds on mobile for better UX
  useEffect(() => {
    if (isImageRevealed && window.innerWidth < 768) {
      const timer = setTimeout(() => {
        setIsImageRevealed(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isImageRevealed]);

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          {/* Primary floating animated blobs - Enhanced for light mode */}
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400/30 via-cyan-300/25 to-purple-400/30 dark:from-blue-400/30 dark:to-purple-600/30 rounded-full blur-3xl"
            animate={{
              x: [0, 120, -60, 0],
              y: [0, -80, 40, 0],
              scale: [1, 1.3, 0.9, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-1/4 -right-32 w-80 h-80 bg-gradient-to-r from-purple-400/25 via-pink-300/20 to-rose-400/25 dark:from-purple-500/25 dark:to-pink-500/25 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 50, 0],
              y: [0, 80, -60, 0],
              scale: [1, 0.8, 1.2, 1],
              rotate: [360, 270, 180, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          
          <motion.div
            className="absolute bottom-10 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-300/20 via-teal-300/15 to-blue-400/25 dark:from-cyan-400/20 dark:to-blue-500/20 rounded-full blur-2xl"
            animate={{
              x: [0, 90, -110, 0],
              y: [0, -70, 60, 0],
              scale: [1, 1.4, 0.6, 1],
              rotate: [0, -90, -180, -270, -360],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-300/15 via-violet-300/20 to-purple-300/15 dark:from-indigo-400/15 dark:to-purple-400/15 rounded-full blur-2xl"
            animate={{
              x: [0, -140, 80, 0],
              y: [0, 100, -90, 0],
              scale: [1, 0.7, 1.3, 1],
              rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />

          {/* Additional light mode specific blobs */}
          <motion.div
            className="absolute top-3/4 right-1/4 w-60 h-60 bg-gradient-to-r from-emerald-300/20 via-green-200/15 to-teal-300/20 dark:from-emerald-400/10 dark:to-teal-400/10 rounded-full blur-2xl"
            animate={{
              x: [0, -70, 40, 0],
              y: [0, -40, 70, 0],
              scale: [1, 1.1, 0.9, 1],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 8
            }}
          />

          <motion.div
            className="absolute top-10 right-10 w-48 h-48 bg-gradient-to-r from-orange-200/25 via-yellow-200/20 to-amber-300/25 dark:from-orange-400/10 dark:to-amber-400/10 rounded-full blur-2xl"
            animate={{
              x: [0, -30, 60, 0],
              y: [0, 50, -25, 0],
              scale: [1, 0.85, 1.15, 1],
              rotate: [360, 240, 120, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
          
          {/* Enhanced animated particles with more variety for light mode */}
          <div className="absolute inset-0 opacity-40 dark:opacity-40">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${
                  i % 4 === 0 
                    ? 'w-1.5 h-1.5 bg-blue-400/40 dark:bg-blue-300/30'
                    : i % 4 === 1 
                    ? 'w-1 h-1 bg-purple-400/50 dark:bg-purple-300/25'
                    : i % 4 === 2
                    ? 'w-2 h-2 bg-cyan-400/30 dark:bg-cyan-300/20'
                    : 'w-0.5 h-0.5 bg-pink-400/60 dark:bg-pink-300/35'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() > 0.5 ? 20 : -20, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Interactive mouse-follow blur effect */}
          <motion.div
            className="absolute w-32 h-32 bg-gradient-to-r from-blue-300/20 via-purple-300/15 to-pink-300/20 dark:from-blue-400/15 dark:via-purple-400/10 dark:to-pink-400/15 rounded-full blur-xl pointer-events-none"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          
          {/* Enhanced gradient mesh overlays for more depth in light mode */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/8 to-transparent dark:via-purple-500/5 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-300/8 to-transparent dark:via-blue-500/5 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200/5 via-transparent to-pink-200/5 dark:from-cyan-400/3 dark:to-pink-400/3 blur-lg" />
          
          {/* Subtle animated grid pattern for light mode */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-10 md:py-20 relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 md:mb-16"
          >
            {/* Profile Card */}
            <motion.div
              className="max-w-4xl mx-auto"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/90 dark:bg-slate-800/20 backdrop-blur-xl border-slate-200/50 dark:border-white/20 shadow-2xl">
                <CardContent className="p-4 md:p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                    {/* Avatar Section */}
                    <div className="relative flex-shrink-0">
                      <motion.div
                        className="w-48 h-32 md:w-64 md:h-40 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-1 cursor-pointer mobile-image-reveal"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleImageClick}
                      >
                        <div className="w-full h-full rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                          <motion.img
                            src="/icon.jpg"
                            alt="Anuj Shrivastava"
                            className="w-full h-full rounded-lg object-cover"
                            style={{ filter: isImageRevealed ? "blur(0px)" : "blur(8px)" }}
                            animate={{ 
                              filter: isImageRevealed ? "blur(0px)" : "blur(8px)"
                            }}
                            transition={{ 
                              duration: 0.6, 
                              ease: [0.4, 0, 0.2, 1] // Smooth cubic-bezier
                            }}
                          />
                          
                          {/* Click indicator overlay when blurred */}
                          {!isImageRevealed && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg"
                              initial={{ opacity: 0.8 }}
                              animate={{ 
                                opacity: [0.6, 1, 0.6],
                                scale: [1, 1.02, 1]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          )}
                          
                          {/* Sparkle Effect when revealed */}
                          {isImageRevealed && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-lg"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1] }}
                              transition={{ 
                                duration: 1.2,
                                ease: "easeOut"
                              }}
                            />
                          )}
                          
                          {/* Shimmer effect on reveal */}
                          {isImageRevealed && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-lg"
                              initial={{ x: "-100%" }}
                              animate={{ x: "200%" }}
                              transition={{ 
                                duration: 0.8,
                                ease: "easeInOut"
                              }}
                            />
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                      <motion.h1
                        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Anuj Shrivastava
                      </motion.h1>
                      
                      <motion.div
                        className="flex items-center justify-center md:justify-start space-x-2 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Code className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Full-Stack Developer</span>
                      </motion.div>
                      
                      <motion.div
                        className="flex items-center justify-center md:justify-start space-x-2 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Brain className="w-5 h-5 text-purple-500" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">AI Enthusiast</span>
                      </motion.div>

                      {/* Social Links */}
                      <motion.div
                        className="flex items-center justify-center md:justify-start space-x-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/50 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 hover:border-slate-400 dark:hover:border-white/30"
                          onClick={() => window.open('https://github.com/AnujShrivastava01', '_blank')}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/50 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 hover:border-slate-400 dark:hover:border-white/30"
                          onClick={() => window.open('https://linkedin.com/in/anuj-shrivastava01', '_blank')}
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <Card className="bg-white/90 dark:bg-slate-800/20 backdrop-blur-xl border-slate-200/50 dark:border-white/20 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Heart className="w-6 h-6 text-red-500" />
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                      Why I Built CampusLens
                    </h2>
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <Sparkles className="w-8 h-8 text-yellow-500 mx-auto animate-pulse" />
                </motion.div>

                <motion.p
                  className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  I frequently worked with an Excel sheet to manage important information like student records, event 
                  lists, or academic data. However, every time I needed to find something specific, I had to go through a 
                  repetitive process: open my laptop, search for the file, launch Excel, and manually apply filters to locate 
                  the data. This became tedious and inefficient, especially when I needed quick access on the go.
                </motion.p>

                <motion.p
                  className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  To streamline this process, I built <span className="text-blue-600 dark:text-blue-400 font-semibold">CampusLens</span> — a simple and efficient solution to store and access 
                  Excel data online. With an intuitive interface, powerful search capabilities, and mobile-friendly design, 
                  I can now find any information instantly, from anywhere. What used to take minutes now takes 
                  seconds, making data management seamless and productive. 
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tech Stack Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-white/90 dark:bg-slate-800/20 backdrop-blur-xl border-slate-200/50 dark:border-white/20 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <motion.h3
                  className="text-2xl md:text-3xl font-bold text-center text-slate-800 dark:text-white mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  🚀 Tech Stack & Features
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="bg-slate-50/80 dark:bg-white/5 rounded-lg p-6 border border-slate-200/50 dark:border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h4 className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-4">Frontend</h4>
                    <ul className="text-slate-700 dark:text-slate-300 space-y-2">
                      <li>• React + TypeScript</li>
                      <li>• Vite for blazing fast builds</li>
                      <li>• Tailwind CSS + Shadcn/ui</li>
                      <li>• Framer Motion animations</li>
                      <li>• Progressive Web App (PWA)</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-slate-50/80 dark:bg-white/5 rounded-lg p-6 border border-slate-200/50 dark:border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <h4 className="text-purple-600 dark:text-purple-400 font-semibold text-lg mb-4">Backend</h4>
                    <ul className="text-slate-700 dark:text-slate-300 space-y-2">
                      <li>• Node.js + Express.js</li>
                      <li>• MongoDB with Mongoose</li>
                      <li>• Clerk for authentication</li>
                      <li>• File upload with Multer</li>
                      <li>• RESTful API design</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-slate-50/80 dark:bg-white/5 rounded-lg p-6 border border-slate-200/50 dark:border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <h4 className="text-green-600 dark:text-green-400 font-semibold text-lg mb-4">Features</h4>
                    <ul className="text-slate-700 dark:text-slate-300 space-y-2">
                      <li>• Excel file upload & parsing</li>
                      <li>• Advanced search & filtering</li>
                      <li>• Real-time data visualization</li>
                      <li>• Responsive mobile design</li>
                      <li>• Dark/Light theme support</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-slate-50/80 dark:bg-white/5 rounded-lg p-6 border border-slate-200/50 dark:border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <h4 className="text-yellow-600 dark:text-yellow-400 font-semibold text-lg mb-4">Deployment</h4>
                    <ul className="text-slate-700 dark:text-slate-300 space-y-2">
                      <li>• Frontend: Vercel</li>
                      <li>• Backend: Render.com</li>
                      <li>• Database: MongoDB Atlas</li>
                      <li>• CI/CD: GitHub Actions</li>
                      <li>• Domain: Custom SSL</li>
                    </ul>
                  </motion.div>
                </div>

                <motion.div
                  className="text-center mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    Built with ❤️ for efficiency and simplicity
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    onClick={() => window.open('https://github.com/AnujShrivastava01/CampusLens', '_blank')}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Source Code
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Developer;
