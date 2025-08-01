import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-8 mt-20"
    >
      <div className="container mx-auto px-4">
        <div className="glass-card text-center">
          <motion.div
            className="flex items-center justify-center space-x-2 text-muted-foreground"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </motion.div>
            <span>by</span>
            <span className="font-semibold text-primary">Anuj</span>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;