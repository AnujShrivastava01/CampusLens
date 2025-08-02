import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/services/api';
import { useUser } from '@clerk/clerk-react';

interface FileUploaderProps {
  onUploadSuccess: () => void;
  maxSize?: number;
  accept?: {
    [key: string]: string[];
  };
}

export function FileUploader({ 
  onUploadSuccess,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = {
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  },
}: FileUploaderProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/octet-stream': ['.xls', '.xlsx'],
      'application/ms-excel': ['.xls'],
      'application/x-excel': ['.xls'],
      'application/x-msexcel': ['.xls']
    },
    maxSize,
    onDropRejected: (fileRejections) => {
      if (fileRejections.length === 0) return;
      
      const error = fileRejections[0].errors[0];
      let message = 'Error uploading file';
      
      if (error.code === 'file-too-large') {
        message = 'File is too large. Maximum size is 10MB';
      } else if (error.code === 'file-invalid-type') {
        message = 'Invalid file type. Please upload an Excel file (.xls, .xlsx)';
      } else if (error.code === 'too-many-files') {
        message = 'You can only upload one file at a time';
      }
      
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: message,
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    // Reset any previous error states
    setError(null);
    
    if (!selectedFile) {
      const error = new Error('No file selected');
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'Please select a file to upload',
      });
      throw error;
    }

    if (!user?.id) {
      const error = new Error('User not authenticated');
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to upload files',
      });
      throw error;
    }
    
    try {
      setIsUploading(true);
      
      // Check file type by extension first (more reliable than MIME type)
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['xls', 'xlsx'];
      const isValidExtension = fileExtension && validExtensions.includes(fileExtension);
      
      // Also check MIME type if available (some browsers might report different MIME types)
      const validMimeTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/octet-stream',
        'application/ms-excel',
        'application/x-excel',
        'application/x-msexcel',
        'application/vnd.ms-excel.sheet.macroenabled.12',
        'application/vnd.ms-excel.sheet.binary.macroenabled.12'
      ];
      
      // Some browsers might not report the MIME type correctly, so we'll be more lenient
      const isLikelyExcel = !selectedFile.type || 
                           validMimeTypes.includes(selectedFile.type) || 
                           selectedFile.type.startsWith('application/octet-stream');
      
      if (!isValidExtension || !isLikelyExcel) {
        const error = new Error('Invalid file type');
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid Excel file (.xls or .xlsx)',
        });
        throw error;
      }
      
      // Check file size (10MB max)
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxFileSize) {
        const error = new Error('File too large');
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'File size exceeds 10MB limit',
        });
        throw error;
      }
      
      // Show upload progress
      toast({
        title: 'Uploading...',
        description: `Processing ${selectedFile.name}`,
        duration: 5000,
      });
      
      // Upload the file with real authentication
      const result = await apiService.uploadExcel(selectedFile);
      
      // Check the upload result
      if (result.success) {
        const { stats } = result;
        
        if (stats.failed > 0) {
          // Show a summary of errors but don't fail the entire upload
          const errorMessage = stats.failed === 1 
            ? '1 row had an error' 
            : `${stats.failed} rows had errors`;
          
          toast({
            variant: 'default',
            title: 'Upload Complete with Issues',
            description: `${stats.successful} rows imported successfully. ${errorMessage}.`,
            duration: 8000,
          });
          
          // Log result to console for debugging
          console.warn('Upload completed with errors:', result);
        } else {
          // Show success message
          toast({
            title: 'Upload Successful',
            description: `Successfully imported ${stats.successful} rows out of ${stats.total}`,
          });
        }
      } else {
        // Handle upload failure
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: result.message || "Failed to upload file",
        });
      }
      
      // Reset the file input and refresh any parent components
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component of successful upload
      onUploadSuccess();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Failed to upload file. Please try again.';
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        // Error thrown in the code
        errorMessage = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-500">
            <Upload className="h-8 w-8" />
          </div>
          {isDragActive ? (
            <p className="text-lg font-medium">Drop the file here</p>
          ) : (
            <div>
              <p className="text-lg font-medium">Drag and drop your Excel file here</p>
              <p className="text-sm text-muted-foreground mt-1">
                or{' '}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: .xls, .xlsx (Max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />

      {selectedFile && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600"
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <Button
            className="mt-4 w-full"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload File'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
