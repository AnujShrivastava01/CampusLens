import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService, Student, StudentsResponse } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { StudentDataTable } from "@/components/students/StudentDataTable";
import { UploadModal } from "@/components/file-uploader/UploadModal";
import Layout from "@/components/Layout/Layout";

interface StudentsPageProps {}

export default function StudentsPage({}: StudentsPageProps) {
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Fetch student data
  const { 
    data: studentsResponse, 
    refetch, 
    isError, 
    error, 
    isPending: isLoading 
  } = useQuery<StudentsResponse>({
    queryKey: ['students'],
    queryFn: async () => {
      try {
        // Fetch student data from the API with pagination
        const response = await apiService.getStudents({
          page: 1,
          limit: 100, // Adjust based on your needs
        });
        return response;
      } catch (error) {
        console.error('Error fetching students:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load student data';
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        throw error; // Re-throw to let React Query handle the error state
      }
    },
    retry: 2, // Retry failed requests up to 2 times
  });
  
  // Extract students array from the response
  const students = studentsResponse?.students || [];

  // Handle successful upload
  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    refetch(); // Refresh the student data
    
    toast({
      title: "Success",
      description: "Student data has been updated successfully.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight">Student Records</h1>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Excel
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              View and manage student records with advanced filtering and search capabilities.
            </p>
          </div>

          {/* Data Table */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading student data...</span>
              </div>
            ) : isError ? (
              <div className="p-8 text-center text-destructive">
                <p>Error loading student data.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {error instanceof Error ? error.message : 'An unknown error occurred'}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <StudentDataTable 
                students={students} 
                isLoading={isLoading} 
                error={error} 
              />
            )}
          </div>
        </div>

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
    </Layout>
  );
}
