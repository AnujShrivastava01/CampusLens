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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          {/* Floating animated blobs */}
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 30, 0],
              y: [0, 60, -40, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          <motion.div
            className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl"
            animate={{
              x: [0, 70, -90, 0],
              y: [0, -50, 80, 0],
              scale: [1, 1.3, 0.7, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl"
            animate={{
              x: [0, -120, 60, 0],
              y: [0, 90, -70, 0],
              scale: [1, 0.8, 1.2, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Animated particles */}
          <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
          
          {/* Gradient mesh overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent blur-sm" />
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
              <Card className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl border-white/20 dark:border-slate-600/30 shadow-2xl">
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
                            transition={{ duration: 0.5 }}
                          />
                          
                          {!isImageRevealed && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg"
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <motion.div
                                className="text-white text-sm font-medium bg-black/40 px-3 py-1 rounded-full"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                👀 Click to reveal
                              </motion.div>
                            </motion.div>
                          )}
                          
                          {/* Online Status Indicator */}
                          {isImageRevealed && (
                            <motion.div
                              className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5, type: "spring" }}
                            />
                          )}
                          
                          {/* GitHub Contributions Effect */}
                          {isImageRevealed && (
                            <motion.div
                              className="absolute top-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              🔥 Online
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                      <motion.h1
                        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
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
                        <Code className="w-5 h-5 text-blue-400" />
                        <span className="text-slate-300 font-medium">Full-Stack Developer</span>
                      </motion.div>
                      
                      <motion.div
                        className="flex items-center justify-center md:justify-start space-x-2 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span className="text-slate-300 font-medium">AI Enthusiast</span>
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
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                          onClick={() => window.open('https://github.com/AnujShrivastava01', '_blank')}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
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
            <Card className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl border-white/20 dark:border-slate-600/30 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Heart className="w-6 h-6 text-red-400" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Why I Built CampusLens
                    </h2>
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <Sparkles className="w-8 h-8 text-yellow-400 mx-auto animate-pulse" />
                </motion.div>

                <motion.p
                  className="text-slate-300 text-base md:text-lg leading-relaxed text-center"
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
                  className="text-slate-300 text-base md:text-lg leading-relaxed text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  To streamline this process, I built <span className="text-blue-400 font-semibold">CampusLens</span> — a simple and efficient solution to store and access 
                  student data online. With an intuitive interface, powerful search capabilities, and mobile-friendly design, 
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
            <Card className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl border-white/20 dark:border-slate-600/30 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <motion.h3
                  className="text-2xl md:text-3xl font-bold text-center text-white mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  🚀 Tech Stack & Features
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="bg-white/5 rounded-lg p-6 border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h4 className="text-blue-400 font-semibold text-lg mb-4">Frontend</h4>
                    <ul className="text-slate-300 space-y-2">
                      <li>• React + TypeScript</li>
                      <li>• Vite for blazing fast builds</li>
                      <li>• Tailwind CSS + Shadcn/ui</li>
                      <li>• Framer Motion animations</li>
                      <li>• Progressive Web App (PWA)</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-white/5 rounded-lg p-6 border border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <h4 className="text-purple-400 font-semibold text-lg mb-4">Backend</h4>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Node.js + Express.js</li>
                      <li>• MongoDB with Mongoose</li>
                      <li>• Clerk for authentication</li>
                      <li>• File upload with Multer</li>
                      <li>• RESTful API design</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-white/5 rounded-lg p-6 border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <h4 className="text-green-400 font-semibold text-lg mb-4">Features</h4>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Excel file upload & parsing</li>
                      <li>• Advanced search & filtering</li>
                      <li>• Real-time data visualization</li>
                      <li>• Responsive mobile design</li>
                      <li>• Dark/Light theme support</li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-white/5 rounded-lg p-6 border border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <h4 className="text-yellow-400 font-semibold text-lg mb-4">Deployment</h4>
                    <ul className="text-slate-300 space-y-2">
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
                  <p className="text-slate-400 text-sm mb-4">
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
