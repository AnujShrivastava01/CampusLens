import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileSpreadsheet, Users, Calendar } from "lucide-react";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage your student data efficiently</p>
            </div>
            <Button variant="gradient" size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload Excel
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded Files</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Upload</p>
                  <p className="text-2xl font-bold">Today</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <Card className="glass-card">
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <Upload className="h-12 w-12 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Ready to upload your first Excel file?</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Get started by uploading student data in Excel format. We'll parse it automatically and make it searchable.
              </p>
              <Button variant="hero" size="lg">
                <Upload className="mr-2 h-5 w-5" />
                Upload Excel File
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;