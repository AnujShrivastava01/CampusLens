import { motion } from "framer-motion";

// Colorful Animated Illustrations
const ExcelUploadIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    fill="none"
    className="mx-auto"
  >
    {/* Laptop base */}
    <motion.rect
      x="20"
      y="45"
      width="80"
      height="30"
      rx="4"
      fill="#e5e7eb"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    {/* Screen */}
    <motion.rect
      x="25"
      y="15"
      width="70"
      height="35"
      rx="3"
      fill="#1f2937"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    {/* Excel grid */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.line
          key={`h-${i}`}
          x1="30"
          y1={22 + i * 6}
          x2="90"
          y2={22 + i * 6}
          stroke="#3b82f6"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <motion.line
          key={`v-${i}`}
          x1={30 + i * 6}
          y1="22"
          x2={30 + i * 6}
          y2="46"
          stroke="#3b82f6"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.9 + i * 0.05 }}
        />
      ))}
    </motion.g>
    {/* Upload arrow */}
    <motion.path
      d="M50 5L55 10L53 10L53 18L47 18L47 10L45 10L50 5Z"
      fill="#10b981"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    />
    {/* Floating data points */}
    {[{x: 35, y: 28, delay: 1.5}, {x: 65, y: 32, delay: 1.7}, {x: 80, y: 38, delay: 1.9}].map((point, i) => (
      <motion.circle
        key={i}
        cx={point.x}
        cy={point.y}
        r="2"
        fill="#f59e0b"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, delay: point.delay }}
      />
    ))}
  </motion.svg>
);

const SecureAuthIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    fill="none"
    className="mx-auto"
  >
    {/* Background circle */}
    <motion.circle
      cx="60"
      cy="40"
      r="30"
      fill="#ecfdf5"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    {/* Shield */}
    <motion.path
      d="M60 15L75 22V38C75 48 60 55 60 55C60 55 45 48 45 38V22L60 15Z"
      fill="#10b981"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    />
    {/* Checkmark */}
    <motion.path
      d="M53 38L58 43L67 32"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    />
    {/* Google logo elements */}
    <motion.circle
      cx="80"
      cy="25"
      r="8"
      fill="white"
      stroke="#e5e7eb"
      strokeWidth="2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, delay: 1.2 }}
    />
    <motion.text
      x="80"
      y="28"
      textAnchor="middle"
      fontSize="8"
      fill="#4285f4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      G
    </motion.text>
    {/* Security waves */}
    {[25, 30, 35].map((r, i) => (
      <motion.circle
        key={i}
        cx="60"
        cy="40"
        r={r}
        stroke="#10b981"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 1.5, delay: 1.8 + i * 0.2, repeat: Infinity, repeatDelay: 3 }}
      />
    ))}
  </motion.svg>
);

const RealTimeProcessingIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    fill="none"
    className="mx-auto"
  >
    {/* Dashboard screen */}
    <motion.rect
      x="15"
      y="20"
      width="90"
      height="50"
      rx="8"
      fill="#f8fafc"
      stroke="#e2e8f0"
      strokeWidth="2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    {/* Screen header */}
    <motion.rect
      x="15"
      y="20"
      width="90"
      height="12"
      fill="#6366f1"
      rx="8"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ transformOrigin: "left" }}
    />
    {/* Chart bars */}
    {[{h: 15, delay: 0.8}, {h: 25, delay: 1.0}, {h: 10, delay: 1.2}, {h: 20, delay: 1.4}].map((bar, i) => (
      <motion.rect
        key={i}
        x={25 + i * 15}
        y={65 - bar.h}
        width="8"
        height={bar.h}
        fill="#8b5cf6"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: bar.delay }}
        style={{ transformOrigin: "bottom" }}
      />
    ))}
    {/* Lightning bolt */}
    <motion.path
      d="M85 35L90 40H87L85 50L80 45H83L85 35Z"
      fill="#f59e0b"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, delay: 1.6 }}
    />
    {/* Pulse effect */}
    <motion.circle
      cx="87"
      cy="42"
      r="8"
      stroke="#f59e0b"
      strokeWidth="2"
      fill="none"
      opacity="0.4"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.5, 0] }}
      transition={{ duration: 2, delay: 2, repeat: Infinity }}
    />
  </motion.svg>
);

const DataFilteringIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    fill="none"
    className="mx-auto"
  >
    {/* Funnel */}
    <motion.path
      d="M25 20L95 20L75 40L45 40L25 20Z"
      fill="#f97316"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6 }}
    />
    <motion.rect
      x="45"
      y="40"
      width="30"
      height="25"
      fill="#f97316"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{ transformOrigin: "top" }}
    />
    {/* Data particles going in */}
    {[{x: 35, y: 15, delay: 0.8}, {x: 50, y: 12, delay: 1.0}, {x: 65, y: 16, delay: 1.2}, {x: 80, y: 14, delay: 1.4}].map((particle, i) => (
      <motion.circle
        key={i}
        cx={particle.x}
        cy={particle.y}
        r="2"
        fill="#3b82f6"
        initial={{ y: particle.y - 20, opacity: 0 }}
        animate={{ y: particle.y, opacity: 1 }}
        transition={{ duration: 0.5, delay: particle.delay }}
      />
    ))}
    {/* Filtered data coming out */}
    {[{x: 55, delay: 1.8}, {x: 65, delay: 2.0}].map((filtered, i) => (
      <motion.circle
        key={i}
        cx={filtered.x}
        cy="72"
        r="2"
        fill="#10b981"
        initial={{ y: 65, opacity: 0 }}
        animate={{ y: 72, opacity: 1 }}
        transition={{ duration: 0.5, delay: filtered.delay }}
      />
    ))}
    {/* Search icon */}
    <motion.circle
      cx="85"
      cy="35"
      r="6"
      stroke="#6b7280"
      strokeWidth="2"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, delay: 1.6 }}
    />
    <motion.line
      x1="89"
      y1="39"
      x2="93"
      y2="43"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, delay: 1.8 }}
    />
  </motion.svg>
);

const ExportDownloadIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    fill="none"
    className="mx-auto"
  >
    {/* Cloud */}
    <motion.ellipse
      cx="60"
      cy="25"
      rx="25"
      ry="12"
      fill="#ec4899"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6 }}
    />
    <motion.circle
      cx="45"
      cy="25"
      r="8"
      fill="#ec4899"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    <motion.circle
      cx="75"
      cy="25"
      r="6"
      fill="#ec4899"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    />
    {/* Download arrow */}
    <motion.path
      d="M60 35L60 55M60 55L55 50M60 55L65 50"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    />
    {/* Files */}
    {[{x: 40, format: 'CSV', delay: 1.5}, {x: 60, format: 'XLS', delay: 1.7}, {x: 80, format: 'PDF', delay: 1.9}].map((file, i) => (
      <motion.g key={i}>
        <motion.rect
          x={file.x - 8}
          y="60"
          width="16"
          height="12"
          rx="2"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="1"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 60, opacity: 1 }}
          transition={{ duration: 0.5, delay: file.delay }}
        />
        <motion.text
          x={file.x}
          y="68"
          textAnchor="middle"
          fontSize="6"
          fill="#6b7280"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: file.delay + 0.2 }}
        >
          {file.format}
        </motion.text>
      </motion.g>
    ))}
  </motion.svg>
);

const DataManagementIllustration = () => (
  <motion.svg
    width="120"
    height="80"
    viewBox="0 0 120 80"
    fill="none"
    className="mx-auto"
  >
    {/* Database cylinders */}
    {[{y: 20, delay: 0}, {y: 35, delay: 0.2}, {y: 50, delay: 0.4}].map((db, i) => (
      <motion.g key={i}>
        <motion.ellipse
          cx="40"
          cy={db.y}
          rx="15"
          ry="5"
          fill="#6366f1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: db.delay }}
        />
        <motion.rect
          x="25"
          y={db.y}
          width="30"
          height="10"
          fill="#6366f1"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, delay: db.delay + 0.2 }}
          style={{ transformOrigin: "top" }}
        />
        <motion.ellipse
          cx="40"
          cy={db.y + 10}
          rx="15"
          ry="5"
          fill="#8b5cf6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: db.delay + 0.4 }}
        />
      </motion.g>
    ))}
    {/* Management tools */}
    <motion.rect
      x="70"
      y="25"
      width="35"
      height="25"
      rx="4"
      fill="#f8fafc"
      stroke="#e2e8f0"
      strokeWidth="2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6, delay: 1 }}
    />
    {/* Settings gear */}
    <motion.circle
      cx="87"
      cy="37"
      r="6"
      stroke="#6b7280"
      strokeWidth="2"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: 360 }}
      transition={{ duration: 1, delay: 1.2 }}
    />
    {/* Gear teeth */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <motion.line
        key={i}
        x1={87 + 8 * Math.cos((angle * Math.PI) / 180)}
        y1={37 + 8 * Math.sin((angle * Math.PI) / 180)}
        x2={87 + 10 * Math.cos((angle * Math.PI) / 180)}
        y2={37 + 10 * Math.sin((angle * Math.PI) / 180)}
        stroke="#6b7280"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
      />
    ))}
  </motion.svg>
);

const FeaturesSection = () => {
  const features = [
    {
      illustration: ExcelUploadIllustration,
      title: "Excel Integration and Upload",
      description: "Seamlessly upload .xlsx and .csv files with automatic parsing and data validation for instant student record management.",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-100 dark:border-blue-800/30"
    },
    {
      illustration: SecureAuthIllustration,
      title: "Secure Authentication System",
      description: "Advanced Google OAuth integration ensuring secure access control and protecting sensitive student information.",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-100 dark:border-green-800/30"
    },
    {
      illustration: RealTimeProcessingIllustration,
      title: "Real-time Data Processing",
      description: "Experience instant data processing with live dashboard updates and real-time synchronization across all platforms.",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-100 dark:border-purple-800/30"
    },
    {
      illustration: DataFilteringIllustration,
      title: "Advanced Smart Filtering",
      description: "Powerful filtering capabilities by student name, mobile number, branch, enrollment date, and custom criteria.",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-100 dark:border-orange-800/30"
    },
    {
      illustration: ExportDownloadIllustration,
      title: "Excel Export Option",
      description: "Download your filtered student data in Excel format with customizable templates for easy data management.",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-100 dark:border-pink-800/30"
    },
    {
      illustration: DataManagementIllustration,
      title: "Comprehensive Data Management",
      description: "Efficiently manage student records with bulk operations, individual sheet management, and automated backup systems.",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-100 dark:border-indigo-800/30"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  return (
    <section id="features" className="py-20 px-4 bg-white dark:bg-gray-900 relative z-10 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Powerful{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Features
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Everything you need to manage student data efficiently and securely, all with AI-driven analysis.
            All in one secure and easy-to-use platform.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
              <div className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-8 h-full transition-all duration-500 hover:shadow-xl hover:border-opacity-50 relative overflow-hidden`}>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/50 to-transparent dark:from-white/10 dark:to-transparent rounded-bl-3xl opacity-70"></div>
                
                {/* Illustration */}
                <motion.div 
                  className="mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.illustration />
                </motion.div>
                
                {/* Content */}
                <div className="space-y-4">
                  <motion.h3 
                    className="text-xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.description}
                  </motion.p>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
