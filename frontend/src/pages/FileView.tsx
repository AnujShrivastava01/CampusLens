import Layout from "@/components/Layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileSpreadsheet, 
  ArrowLeft, 
  Search, 
  Filter, 
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { apiService, Student } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";

interface FileData {
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  file: {
    id: string;
    filename: string;
    status: string;
    totalRecords: number;
    processedRecords: number;
    failedRecords: number;
    headers: string[];
  };
}

const FileView = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSignedIn, user, isLoaded } = useUser();
  
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters]);

  const fetchFileData = useCallback(async () => {
    if (!fileId) {
      setError('File ID is required');
      setIsLoading(false);
      return;
    }

    if (!isSignedIn) {
      setError('Please sign in to view file data');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching data for file:', fileId); // Debug log
      
      const response = await apiService.getFileData(fileId, {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      });
      
      console.log('File data response:', response); // Debug log
      setFileData(response.data);
      console.log('Headers from file:', response.data.file.headers); // Debug log
      console.log('Students data:', response.data.students); // Debug log
    } catch (error) {
      console.error('Error fetching file data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load file data';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [fileId, currentPage, pageSize, debouncedSearch, filters, isSignedIn, toast]);

  useEffect(() => {
    if (isLoaded) {
      fetchFileData();
    }
  }, [fetchFileData, isLoaded]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchFileData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filters]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'completed_with_errors':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />With Errors</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleFilterChange = (header: string, value: string | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value && value !== '' && value !== 'ALL') {
        newFilters[header] = value;
      } else {
        delete newFilters[header]; // Remove the filter if value is empty/undefined/ALL
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearch('');
    setCurrentPage(1);
  };

  const renderCellValue = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const getUniqueColumnValues = (header: string): string[] => {
    if (!fileData?.students) return [];
    
    const values = new Set<string>();
    fileData.students.forEach(student => {
      const value = student._rawData?.[header] || student[header as keyof Student];
      if (value !== null && value !== undefined && value !== '') {
        const stringValue = String(value).trim();
        if (stringValue.length > 0) {
          values.add(stringValue);
        }
      }
    });
    
    return Array.from(values).slice(0, 10).filter(v => v && v.trim() !== ''); // Extra filtering
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
              Please sign in to view file data.
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

  // Show loading state while fetching file data
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !fileData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading File</h3>
            <p className="text-gray-600 mb-4">{error || 'File not found'}</p>
            <div className="space-x-2">
              <Button onClick={fetchFileData}>Retry</Button>
              <Button variant="outline" onClick={() => navigate('/files')}>
                Back to Files
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const { file, students, pagination } = fileData;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/files')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Files
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileSpreadsheet className="w-8 h-8 mr-3 text-green-600" />
                {file.filename}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                {getStatusBadge(file.status)}
                <span className="text-sm text-gray-500">
                  {file.totalRecords} total • {file.processedRecords} processed
                  {file.failedRecords > 0 && ` • ${file.failedRecords} failed`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters and Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Global Search */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search all fields..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  {search !== debouncedSearch && (
                    <div className="absolute right-3 top-3 h-4 w-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Column Filters */}
              {file?.headers && file.headers.length > 0 && file.headers.slice(0, 4).map(header => {
                const uniqueValues = getUniqueColumnValues(header);
                const currentValue = filters[header] || "ALL";
                return (
                  <div key={header}>
                    <Select
                      value={currentValue}
                      onValueChange={(value) => handleFilterChange(header, value === "ALL" ? undefined : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Filter by ${header}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All {header}</SelectItem>
                        {uniqueValues.map(value => {
                          const stringValue = String(value);
                          if (!stringValue || stringValue.trim() === '') return null;
                          return (
                            <SelectItem key={stringValue} value={stringValue}>
                              {stringValue}
                            </SelectItem>
                          );
                        }).filter(Boolean)}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
              
              {/* Clear Filters */}
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Data ({pagination.total} records)</CardTitle>
              <div className="flex items-center space-x-2">
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={(value) => {
                    const newSize = Number(value);
                    if (newSize > 0) {
                      setPageSize(newSize);
                    }
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">per page</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {file?.headers && file.headers.map(header => (
                      <TableHead key={header} className="min-w-[150px]">
                        {header}
                      </TableHead>
                    ))}
                    <TableHead>Row #</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!students || students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={(file?.headers?.length || 0) + 1} className="text-center py-8">
                        {isLoading ? 'Loading data...' : 'No data found matching your criteria'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student, index) => (
                      <TableRow key={student._id || index}>
                        {file?.headers && file.headers.map(header => (
                          <TableCell key={header}>
                            {renderCellValue(student._rawData?.[header] || student[header as keyof Student])}
                          </TableCell>
                        ))}
                        <TableCell className="text-gray-500">
                          {student.rowNumber || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= pagination.pages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FileView;
