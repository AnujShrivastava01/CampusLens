import { motion } from "framer-motion";
import { Github, Linkedin, ExternalLink, Heart, Sparkles, Code, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout/Layout";

const Developer = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Enhanced Background Effects with Excel Design */}
        <div className="absolute inset-0 opacity-30">
          {/* Excel-like Grid Background */}
          <div 
            className="absolute inset-0 opacity-8 blur-sm"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '40px 30px'
            }}
          ></div>
          
          {/* Excel Column Headers */}
          <div className="absolute top-10 left-10 md:top-20 md:left-20 blur-md opacity-10">
            <div className="flex space-x-1">
              {['A', 'B', 'C', 'D', 'E', 'F'].map((col, index) => (
                <div 
                  key={col}
                  className="w-8 h-6 md:w-12 md:h-8 bg-slate-300/30 border border-slate-400/20 flex items-center justify-center text-xs font-semibold text-slate-600"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>

          {/* Excel Row Numbers */}
          <div className="absolute top-16 left-2 md:top-32 md:left-8 blur-md opacity-10">
            <div className="flex flex-col space-y-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                <div 
                  key={row}
                  className="w-6 h-5 md:w-8 md:h-6 bg-slate-300/30 border border-slate-400/20 flex items-center justify-center text-xs font-semibold text-slate-600"
                >
                  {row}
                </div>
              ))}
            </div>
          </div>

          {/* Excel Data Cells */}
          <div className="absolute top-16 left-10 md:top-32 md:left-20 blur-md opacity-8">
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 48 }, (_, i) => (
                <div 
                  key={i}
                  className="w-8 h-5 md:w-12 md:h-6 bg-white/40 border border-slate-300/30 text-xs text-slate-500 flex items-center px-1"
                >
                  {i % 3 === 0 ? 'Name' : i % 3 === 1 ? '123' : 'Data'}
                </div>
              ))}
            </div>
          </div>

          {/* Excel Sheet Tabs */}
          <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 blur-md opacity-12">
            <div className="flex space-x-2">
              {['Students', 'Faculty'].map((tab, index) => (
                <div 
                  key={tab}
                  className={`px-2 py-1 md:px-4 md:py-2 text-xs font-medium border-t-2 ${
                    index === 0 
                      ? 'bg-white/50 border-blue-400/50 text-blue-600' 
                      : 'bg-slate-200/30 border-slate-300/30 text-slate-600'
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>

          {/* Excel Formula Bar */}
          <div className="absolute top-5 left-16 right-16 md:top-12 md:left-32 md:right-32 blur-md opacity-12">
            <div className="h-5 md:h-6 bg-white/40 border border-slate-300/30 flex items-center px-2 text-xs text-slate-600">
              =VLOOKUP(A2,Students!A:D,2,FALSE)
            </div>
          </div>

          {/* Gradient orbs */}
          <div className="absolute top-20 left-20 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
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
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-600/50 shadow-2xl">
                <CardContent className="p-4 md:p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                    {/* Avatar Section */}
                    <div className="relative flex-shrink-0">
                      <motion.div
                        className="w-48 h-32 md:w-64 md:h-40 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-1"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-full h-full rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                          <motion.img
                            src="/icon.jpg"
                            alt="Anuj Shrivastava"
                            className="w-full h-full rounded-lg object-cover filter blur-sm"
                            whileHover={{ filter: "blur(0px)" }}
                            whileTap={{ filter: "blur(0px)" }}
                            transition={{ duration: 0.3 }}
                          />
                          {/* Sparkle Effect on Hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-lg"
                            initial={{ opacity: 0, scale: 0 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </motion.div>
                      <motion.div
                        className="absolute -bottom-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                      </motion.div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                      <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3"
                      >
                        <motion.span 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          Anuj Shrivastava
                        </motion.span>
                      </motion.h1>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="space-y-2 mb-4 md:mb-6"
                      >
                        <div className="flex items-center justify-center md:justify-start space-x-2">
                          <Code className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                          <span className="text-sm md:text-lg text-slate-600 dark:text-slate-300 font-medium">
                            Full-Stack Developer
                          </span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start space-x-2">
                          <Brain className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                          <span className="text-sm md:text-lg text-slate-600 dark:text-slate-300 font-medium">
                            AI Enthusiast
                          </span>
                        </div>
                      </motion.div>

                      {/* Social Links */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex justify-center md:justify-start space-x-3 md:space-x-4"
                      >
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="group hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:shadow-lg text-xs md:text-sm"
                          >
                            <a
                              href="https://github.com/AnujShrivastava01"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 md:space-x-2"
                            >
                              <Github className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                              <span>GitHub</span>
                              <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:rotate-12 transition-transform" />
                            </a>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="group hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:shadow-lg text-xs md:text-sm"
                          >
                            <a
                              href="https://www.linkedin.com/in/anujshrivastava1/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 md:space-x-2"
                            >
                              <Linkedin className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                              <span>LinkedIn</span>
                              <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:rotate-12 transition-transform" />
                            </a>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </motion.div>

          {/* Purpose Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-4xl mx-auto border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-4 md:p-8 relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2 md:top-4 md:right-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-purple-400/50" />
                    </motion.div>
                  </div>
                  
                  <motion.h2 
                    className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-white flex items-center justify-center space-x-2 md:space-x-3"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className="w-5 h-5 md:w-8 md:h-8 text-red-500 animate-pulse" />
                    <span>Why I Built CampusLens</span>
                    <Heart className="w-5 h-5 md:w-8 md:h-8 text-red-500 animate-pulse" />
                  </motion.h2>
                  
                  <motion.div 
                    className="space-y-4 md:space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    <motion.p 
                      className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      I frequently worked with an Excel sheet to manage important information like student records, event lists, or academic data. However, every time I needed to find something specific, I had to go through a repetitive process: open my laptop, search for the file, launch Excel, and manually apply filters to locate the data. This became tedious and inefficient, especially when I needed quick access on the go.
                    </motion.p>
                    
                    <motion.p 
                      className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      To streamline this process, I built CampusLens — a simple and efficient solution to store and access frequently used information. With CampusLens, I can instantly search for any detail without opening large files or applying filters. It's designed not only for personal use but also for faculty members who can upload student details once and retrieve them anytime with ease.
                    </motion.p>

                    <motion.p 
                      className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      CampusLens eliminates the need for repeated file handling and brings all the essential data to your fingertips — accessible anytime, anywhere, with just a few clicks.
                    </motion.p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400 mt-6 md:mt-8"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm">Built with</span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    </motion.div>
                    <span className="text-sm">for the education community</span>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                    </motion.div>
                  </motion.div>

                  {/* Tech Stack Badges */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 md:mt-8"
                  >
                    {['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'].map((tech, index) => (
                      <motion.span
                        key={tech}
                        className="px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs md:text-sm font-medium border border-blue-200/50 dark:border-blue-700/50"
                        whileHover={{ 
                          scale: 1.1, 
                          y: -2,
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Developer;
