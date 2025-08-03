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
  const [uniqueValues, setUniqueValues] = useState<Record<string, any[]>>({});
  const [isLoadingUniqueValues, setIsLoadingUniqueValues] = useState(false);
  
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
      
      const response = await apiService.getFileData(fileId, {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      });
      
      setFileData(response.data);
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

  // Fetch unique values for filter dropdowns
  const fetchUniqueValues = useCallback(async () => {
    if (!fileId || !isSignedIn) {
      return;
    }

    try {
      setIsLoadingUniqueValues(true);
      const response = await apiService.getFileUniqueValues(fileId);
      
      if (response && response.uniqueValues && Object.keys(response.uniqueValues).length > 0) {
        setUniqueValues(response.uniqueValues);
      } else {
        useFallbackUniqueValues();
      }
    } catch (error) {
      // Fallback: use local data from current page if API fails
      useFallbackUniqueValues();
      
      toast({
        variant: "destructive",
        title: "Error loading filter options",
        description: "Using fallback data from current page.",
      });
    } finally {
      setIsLoadingUniqueValues(false);
    }
  }, [fileId, isSignedIn, toast]);

  // Get filtered unique values based on current filters (dynamic filtering)
  const getFilteredUniqueValues = useCallback((targetHeader: string) => {
    if (!fileData?.students || Object.keys(uniqueValues).length === 0) {
      return uniqueValues[targetHeader] || [];
    }

    // If no filters are applied, return all unique values
    const activeFilters = Object.keys(filters).filter(key => filters[key] && key !== targetHeader);
    if (activeFilters.length === 0) {
      return uniqueValues[targetHeader] || [];
    }

    // Create filter object excluding the target header
    const filtersForQuery = { ...filters };
    delete filtersForQuery[targetHeader];

    // For now, use local filtering until we can call the API efficiently
    // In a production app, you might debounce API calls or cache results
    const matchingRecords = fileData.students.filter(student => {
      return activeFilters.every(filterKey => {
        const filterValue = filters[filterKey];
        const studentValue = student._rawData?.[filterKey] || student[filterKey as keyof Student];
        return String(studentValue) === filterValue;
      });
    });

    // Extract unique values for the target header from matching records
    const filteredValues = new Set<string>();
    matchingRecords.forEach(student => {
      const value = student._rawData?.[targetHeader] || student[targetHeader as keyof Student];
      if (value !== null && value !== undefined && value !== '') {
        const stringValue = String(value).trim();
        if (stringValue.length > 0) {
          filteredValues.add(stringValue);
        }
      }
    });

    const result = Array.from(filteredValues);
    return result;
  }, [fileData, uniqueValues, filters]);

  // Fallback function to generate unique values from current page data
  const useFallbackUniqueValues = useCallback(() => {
    if (fileData?.students && fileData.file?.headers) {
      const fallbackUniqueValues: Record<string, any[]> = {};
      
      fileData.file.headers.forEach(header => {
        const values = new Set<string>();
        fileData.students.forEach(student => {
          // Try multiple ways to get the value
          let value = student._rawData?.[header] || student[header as keyof Student];
          
          // Also try common field mappings
          if (!value && header.toLowerCase().includes('name')) {
            value = student.firstName || student.lastName || student.fullName;
          }
          if (!value && header.toLowerCase().includes('department')) {
            value = student.program;
          }
          
          if (value !== null && value !== undefined && value !== '') {
            const stringValue = String(value).trim();
            if (stringValue.length > 0) {
              values.add(stringValue);
            }
          }
        });
        fallbackUniqueValues[header] = Array.from(values).slice(0, 50); // Limit to 50 values
      });
      
      setUniqueValues(fallbackUniqueValues);
      
      // Show success message
      toast({
        title: "Filter options loaded",
        description: `Loaded filter options for ${Object.keys(fallbackUniqueValues).length} columns.`,
      });
    }
  }, [fileData, toast]);

  // Fetch unique values when component mounts or fileId changes
  useEffect(() => {
    if (isLoaded && fileId && isSignedIn) {
      fetchUniqueValues();
    }
  }, [fetchUniqueValues, isLoaded, fileId, isSignedIn]);

  // Also use fallback unique values when fileData is loaded and no unique values exist
  useEffect(() => {
    const hasFileData = !!fileData?.students?.length;
    const hasNoUniqueValues = Object.keys(uniqueValues).length === 0;
    const notCurrentlyLoading = !isLoadingUniqueValues;
    
    if (hasFileData && hasNoUniqueValues && notCurrentlyLoading) {
      setTimeout(() => useFallbackUniqueValues(), 500); // Small delay to ensure data is fully loaded
    }
  }, [fileData, uniqueValues, isLoadingUniqueValues, useFallbackUniqueValues]);

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
      
      // Clear dependent filters that may no longer be valid
      // For example, if Department changes, clear Name filter if the selected name
      // is not available in the new department
      const remainingHeaders = file?.headers || [];
      remainingHeaders.forEach(otherHeader => {
        if (otherHeader !== header && newFilters[otherHeader]) {
          // Check if the current value for this filter is still valid
          const filteredOptions = getFilteredUniqueValues(otherHeader);
          if (!filteredOptions.includes(newFilters[otherHeader])) {
            delete newFilters[otherHeader];
          }
        }
      });
      
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

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (!isSignedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
        </div>
      </Layout>
    );
  }

  // Show loading state while fetching file data
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !fileData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
        </div>
      </Layout>
    );
  }

  const { file, students, pagination } = fileData;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full flex items-center justify-start">
              <Button variant="outline" onClick={() => navigate('/files')}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Files
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                <FileSpreadsheet className="w-8 h-8 mr-3 text-green-600" />
                {file.filename}
              </h1>
              <div className="flex items-center justify-center space-x-4 mt-2">
                {getStatusBadge(file.status)}
                <span className="text-sm text-gray-500">
                  {file.totalRecords} total • {file.processedRecords} processed
                  {file.failedRecords > 0 && ` • ${file.failedRecords} failed`}
                </span>
              </div>
            </div>
          </div>

        {/* Filters and Search */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
                  <Search className={`absolute left-3 top-3 h-4 w-4 ${debouncedSearch ? 'text-blue-500' : 'text-gray-400'}`} />
                  <Input
                    placeholder="Search all fields..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`pl-10 ${debouncedSearch ? 'border-blue-300 bg-blue-50' : ''}`}
                  />
                  {search !== debouncedSearch && (
                    <div className="absolute right-8 top-3 h-4 w-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {debouncedSearch && search === debouncedSearch && (
                    <div className="absolute right-8 top-3 h-4 w-4 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
                {debouncedSearch && (
                  <p className="text-xs text-gray-500 mt-1">
                    Searching for: "{debouncedSearch}"
                  </p>
                )}
              </div>
              
              {/* Column Filters */}
              {file?.headers && file.headers.length > 0 && file.headers.map(header => {
                // Use dynamic filtering - get options that match current filters
                const headerUniqueValues = getFilteredUniqueValues(header);
                const currentValue = filters[header] || "ALL";
                
                // Debug logging
                console.log(`Filter for ${header}:`, {
                  headerUniqueValues,
                  uniqueValuesKeys: Object.keys(uniqueValues),
                  isLoadingUniqueValues,
                  currentValue,
                  activeFilters: Object.keys(filters).filter(k => filters[k])
                });
                
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
                        {isLoadingUniqueValues ? (
                          <SelectItem value="LOADING" disabled>
                            Loading options...
                          </SelectItem>
                        ) : headerUniqueValues.length === 0 ? (
                          <SelectItem value="NO_DATA" disabled>
                            No options available
                          </SelectItem>
                        ) : (
                          headerUniqueValues.map(value => {
                            const stringValue = String(value);
                            if (!stringValue || stringValue.trim() === '') return null;
                            return (
                              <SelectItem key={stringValue} value={stringValue}>
                                {stringValue}
                              </SelectItem>
                            );
                          }).filter(Boolean)
                        )}
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
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Data ({pagination.total} records)</span>
                  {(debouncedSearch || Object.keys(filters).length > 0) && (
                    <Badge variant="secondary" className="ml-2">
                      Filtered
                    </Badge>
                  )}
                </CardTitle>
                {(debouncedSearch || Object.keys(filters).length > 0) && (
                  <div className="mt-1 space-y-1">
                    {debouncedSearch && (
                      <p className="text-sm text-gray-600">
                        🔍 Searching: "{debouncedSearch}"
                      </p>
                    )}
                    {Object.keys(filters).length > 0 && (
                      <p className="text-sm text-gray-600">
                        🎛️ Filters: {Object.entries(filters).map(([k, v]) => `${k}="${v}"`).join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!students || students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={file?.headers?.length || 0} className="text-center py-8">
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            <span>Loading data...</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p>
                              {debouncedSearch || Object.keys(filters).length > 0 
                                ? 'No data found matching your search criteria' 
                                : 'No data found'
                              }
                            </p>
                            {debouncedSearch && (
                              <p className="text-sm text-gray-500">
                                Searched for: "{debouncedSearch}"
                              </p>
                            )}
                            {Object.keys(filters).length > 0 && (
                              <p className="text-sm text-gray-500">
                                Active filters: {Object.entries(filters).map(([k, v]) => `${k}: ${v}`).join(', ')}
                              </p>
                            )}
                          </div>
                        )}
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
      </div>
    </Layout>
  );
};

export default FileView;
