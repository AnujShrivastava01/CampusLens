import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileSpreadsheet, 
  Eye, 
  Calendar, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Trash2,
  Download
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";

interface UploadedFile {
  _id: string;
  filename: string;
  size: number;
  status: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  createdAt: string;
  completedAt?: string;
}

const Files = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();

  const fetchFiles = useCallback(async () => {
    if (!isSignedIn) {
      setError('Please sign in to view your files');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getUploadedFiles();
      setFiles(response.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load files';
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
      fetchFiles();
    }
  }, [fetchFiles, isLoaded]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'completed_with_errors':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />With Errors</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewFile = (fileId: string) => {
    navigate(`/files/${fileId}`);
  };

  const handleDeleteFile = async (fileId: string, filename: string) => {
    if (!isSignedIn) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to delete files",
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteFile(fileId);
      
      toast({
        title: "Success",
        description: `File "${filename}" deleted successfully`,
      });
      
      // Refresh the files list
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
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

  // Show sign-in prompt for unauthenticated users
  if (!isSignedIn) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 text-center max-w-md">
            <FileSpreadsheet className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-6">
              Please sign in to view and manage your uploaded files.
            </p>
            <div className="space-x-2">
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline">Sign Up</Button>
              </SignUpButton>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // Show loading state while fetching files
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Files</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchFiles}>Retry</Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Uploaded Files</h1>
            <p className="text-gray-600 mt-1">
              View and manage your uploaded Excel files
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {files.length === 0 ? (
          <Card className="p-12 text-center">
            <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Files Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't uploaded any files yet. Upload your first Excel file to get started.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {files.map((file, index) => (
              <motion.div
                key={file._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileSpreadsheet className="w-8 h-8 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">{file.filename}</CardTitle>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • Uploaded {formatDate(file.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(file.status)}
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            onClick={() => handleViewFile(file._id)}
                            className="ml-2"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Data
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFile(file._id, file.filename)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>
                          <span className="font-medium">{file.totalRecords}</span> Total Records
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>
                          <span className="font-medium">{file.processedRecords}</span> Processed
                        </span>
                      </div>
                      {file.failedRecords > 0 && (
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span>
                            <span className="font-medium">{file.failedRecords}</span> Failed
                          </span>
                        </div>
                      )}
                    </div>
                    {file.completedAt && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Completed {formatDate(file.completedAt)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Files;
