import { motion } from "framer-motion";
import { FileSpreadsheet, Shield, Zap, Filter, Download, Trash2 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: FileSpreadsheet,
      title: "Excel Integration",
      description: "Upload .xlsx and .csv files with automatic parsing and validation",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Google OAuth integration for secure access control",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Instant data processing and live dashboard updates",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Filter by name, mobile number, branch, and upload date",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Download filtered data in multiple formats",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Trash2,
      title: "Data Management",
      description: "Delete individual sheets or bulk data operations",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="features" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Powerful <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Everything you need to manage student data efficiently and securely
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
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
            >
              <div className="glass-card h-full hover:scale-105 transition-all duration-300 hover:shadow-xl p-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base text-center">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;