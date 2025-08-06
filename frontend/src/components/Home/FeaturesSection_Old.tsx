import { motion } from "framer-motion";
import { FileSpreadsheet, Shield, Zap, Filter, Download, Trash2 } from "lucide-react";

// Animated SVG Components
const AnimatedExcelIcon = () => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="text-white"
  >
    <motion.rect
      x="8"
      y="6"
      width="24"
      height="28"
      rx="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    <motion.line
      x1="13"
      y1="12"
      x2="27"
      y2="12"
      stroke="#1e40af"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    />
    <motion.line
      x1="13"
      y1="16"
      x2="27"
      y2="16"
      stroke="#1e40af"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    />
    <motion.line
      x1="13"
      y1="20"
      x2="27"
      y2="20"
      stroke="#1e40af"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.9 }}
    />
    <motion.circle
      cx="15"
      cy="24"
      r="1"
      fill="#22c55e"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5, delay: 1.2 }}
    />
  </motion.svg>
);

const AnimatedShieldIcon = () => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="text-white"
  >
    <motion.path
      d="M20 4L30 8V18C30 26 20 32 20 32C20 32 10 26 10 18V8L20 4Z"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    />
    <motion.path
      d="M16 18L18.5 20.5L24 15"
      stroke="#16a34a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    />
    <motion.circle
      cx="20"
      cy="18"
      r="8"
      stroke="#16a34a"
      strokeWidth="1"
      fill="none"
      opacity="0.3"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.1, 1] }}
      transition={{ duration: 0.8, delay: 0.8, repeat: Infinity, repeatDelay: 2 }}
    />
  </motion.svg>
);

const AnimatedZapIcon = () => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="text-white"
  >
    <motion.path
      d="M22 4L12 20H18L16 36L26 20H20L22 4Z"
      fill="currentColor"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    />
    <motion.circle
      cx="20"
      cy="20"
      r="15"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.2"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
    />
  </motion.svg>
);

const AnimatedFilterIcon = () => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="text-white"
  >
    <motion.path
      d="M8 8H32L24 18V28L16 24V18L8 8Z"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6 }}
    />
    {[0, 1, 2].map((i) => (
      <motion.circle
        key={i}
        cx={12 + i * 6}
        cy={12 + i * 2}
        r="1"
        fill="#f97316"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 0] }}
        transition={{ 
          duration: 1.5, 
          delay: 0.5 + i * 0.2,
          repeat: Infinity,
          repeatDelay: 2
        }}
      />
    ))}
  </motion.svg>
);

const AnimatedDownloadIcon = () => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="text-white"
  >
    <motion.path
      d="M20 4V24M20 24L26 18M20 24L14 18"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    />
    <motion.path
      d="M8 28V32C8 33.1 8.9 34 10 34H30C31.1 34 32 33.1 32 32V28"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    />
    <motion.circle
      cx="20"
      cy="30"
      r="2"
      fill="#ec4899"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5, delay: 1.2 }}
    />
  </motion.svg>
);

const AnimatedTrashIcon = () => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className="text-white"
  >
    <motion.path
      d="M12 12H28V32C28 33.1 27.1 34 26 34H14C12.9 34 12 33.1 12 32V12Z"
      fill="currentColor"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ transformOrigin: "bottom" }}
    />
    <motion.path
      d="M8 10H32"
      stroke="#6366f1"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8 }}
    />
    <motion.path
      d="M16 6H24"
      stroke="#6366f1"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    />
    {[16, 20, 24].map((x, i) => (
      <motion.line
        key={i}
        x1={x}
        y1="16"
        x2={x}
        y2="28"
        stroke="#6366f1"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
      />
    ))}
  </motion.svg>
);

const FeaturesSection = () => {
  const features = [
    {
      AnimatedIcon: AnimatedExcelIcon,
      title: "Excel Integration",
      description: "Upload .xlsx and .csv files with automatic parsing",
      color: "from-blue-500 to-cyan-500"
    },
    {
      AnimatedIcon: AnimatedShieldIcon,
      title: "Secure Authentication",
      description: "Google OAuth integration for secure access",
      color: "from-green-500 to-emerald-500"
    },
    {
      AnimatedIcon: AnimatedZapIcon,
      title: "Real-time Processing",
      description: "Instant data processing and live updates",
      color: "from-purple-500 to-violet-500"
    },
    {
      AnimatedIcon: AnimatedFilterIcon,
      title: "Advanced Filtering",
      description: "Filter by name, mobile, branch, and date",
      color: "from-orange-500 to-red-500"
    },
    {
      AnimatedIcon: AnimatedDownloadIcon,
      title: "Export Options",
      description: "Download filtered data in multiple formats",
      color: "from-pink-500 to-rose-500"
    },
    {
      AnimatedIcon: AnimatedTrashIcon,
      title: "Data Management",
      description: "Delete individual sheets or bulk operations",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section id="features" className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Powerful <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Everything you need to manage student data efficiently and securely
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
            >
              <div className="glass-card h-full transition-all duration-500 hover:shadow-2xl p-5 relative overflow-hidden">
                {/* Background Animation */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`
                  }}
                />
                
                {/* Animated Icon Container */}
                <motion.div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-2 mb-4 mx-auto relative`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <feature.AnimatedIcon />
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`,
                      filter: 'blur(8px)',
                      transform: 'scale(1.2)'
                    }}
                  />
                </motion.div>
                
                <motion.h3 
                  className="text-lg md:text-xl font-semibold mb-2 text-center group-hover:text-primary transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  className="text-muted-foreground leading-relaxed text-sm md:text-base text-center"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.description}
                </motion.p>

                {/* Floating dots animation */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-current rounded-full absolute"
                      style={{ 
                        top: i * 4,
                        right: i * 3
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;