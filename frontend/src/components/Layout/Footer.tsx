import { motion } from "framer-motion";
import { Heart, Github, Linkedin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="w-full py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-3 md:space-y-0 relative">
            {/* Left side - Hidden on desktop for centering, visible on mobile */}
            <div className="hidden md:block md:w-48"></div>

            {/* Center - Made with love */}
            <div className="flex items-center space-x-2 text-muted-foreground md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              </motion.div>
              <span>by</span>
              <span className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-default">Anuj Shrivastava</span>
            </div>

            {/* Right side - Social links */}
            <div className="flex items-center space-x-4 md:w-48 md:justify-end">
              <motion.a
                href="https://www.linkedin.com/in/anujshrivastava1/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Linkedin className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">LinkedIn</span>
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
              </motion.a>

              <motion.a
                href="https://github.com/AnujShrivastava01"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-800 dark:hover:border-gray-300 transition-colors group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Github className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">GitHub</span>
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </motion.a>
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} CampusLens. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;