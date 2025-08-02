import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileSpreadsheet, Users, Calendar, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { UploadModal } from "@/components/file-uploader/UploadModal";

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  programStats: Array<{ _id: string; count: number }>;
  yearStats: Array<{ _id: number; count: number }>;
  averageGPA: number;
  uploadStats: {
    totalUploads: number;
    lastUpload: string | null;
  };
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const refreshStats = useCallback(async () => {
    if (!isSignedIn) {
      setStats({
        totalStudents: 0,
        activeStudents: 0,
        programStats: [],
        yearStats: [],
        averageGPA: 0,
        uploadStats: {
          totalUploads: 0,
          lastUpload: null,
        },
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Fetch user-specific upload stats only  
      let uploadStats = { totalUploads: 0, lastUpload: null };
      try {
        uploadStats = await apiService.getUploadStats();
      } catch (uploadError) {
        console.warn('Warning: Could not fetch upload stats:', uploadError);
        // Continue with default values if there's an error
      }
      
      // For user-specific data, we only show upload stats since students
      // are now file-specific rather than global
      setStats({
        totalStudents: 0, // Will be calculated from user's uploaded files
        activeStudents: 0,
        programStats: [],
        yearStats: [],
        averageGPA: 0,
        uploadStats: {
          totalUploads: uploadStats.totalUploads || 0,
          lastUpload: uploadStats.lastUpload || null
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard statistics';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, toast]);

  useEffect(() => {
    if (isLoaded) {
      refreshStats();
    }
  }, [refreshStats, isLoaded]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Never') return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show welcome screen for unauthenticated users
  if (!isSignedIn) {
    return (
      <Layout>
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <h1 className="text-4xl font-bold mb-4">Welcome to CampusLens</h1>
            <p className="text-xl text-gray-600 mb-8">
              Manage your student data efficiently with our Excel-based platform
            </p>
            <div className="space-x-4">
              <SignInButton mode="modal">
                <Button size="lg">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" size="lg">Sign Up</Button>
              </SignUpButton>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
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
            <Button 
              variant="gradient" 
              size="lg"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Excel
            </Button>
            
            <UploadModal 
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              onUploadSuccess={refreshStats}
            />
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
                  <p className="text-2xl font-bold">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatNumber(stats?.totalStudents || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-card">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : formatNumber(stats?.uploadStats?.totalUploads || 0)}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : stats?.uploadStats?.lastUpload ? (
                      formatDate(stats.uploadStats.lastUpload)
                    ) : (
                      'Never'
                    )}
                  </p>
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
              <h3 className="text-2xl font-semibold mb-4">
                {(stats?.uploadStats?.totalUploads || 0) > 0 
                  ? 'Ready to upload more files?' 
                  : 'Ready to upload your first Excel file?'
                }
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {(stats?.uploadStats?.totalUploads || 0) > 0 
                  ? 'Upload more student data or view your existing files to explore the data.'
                  : 'Get started by uploading student data in Excel format. We\'ll parse it automatically and make it searchable.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Excel File
                </Button>
                {(stats?.uploadStats?.totalUploads || 0) > 0 && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/files')}
                  >
                    <FileSpreadsheet className="mr-2 h-5 w-5" />
                    View Files ({stats?.uploadStats?.totalUploads})
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Recent Activity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload New File
              </Button>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <p className="text-muted-foreground text-center py-8">
                {stats?.uploadStats?.lastUpload && stats.uploadStats.lastUpload !== 'Never'
                  ? `Last upload: ${formatDate(stats.uploadStats.lastUpload)}`
                  : 'No recent uploads'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;