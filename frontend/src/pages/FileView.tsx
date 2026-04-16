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
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiService, Student } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";

// Custom styles for better dropdown scrolling
const dropdownStyles = `
  .select-dropdown-content {
    overscroll-behavior: contain;
    scroll-behavior: smooth;
  }
  .select-dropdown-content::-webkit-scrollbar {
    width: 6px;
  }
  .select-dropdown-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .select-dropdown-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }
  .select-dropdown-content::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = dropdownStyles;
  document.head.appendChild(styleElement);
}

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
  const [searchTerm, setSearchTerm] = useState(''); // Immediate input value
  const [search, setSearch] = useState('');         // Debounced filtered value
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

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

      // Fetch all records at once for client-side filtering
      const response = await apiService.getFileData(fileId, {
        page: 1,
        limit: 100000,
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
  }, [fileId, isSignedIn, toast]);

  useEffect(() => {
    if (isLoaded) {
      fetchFileData();
    }
  }, [fetchFileData, isLoaded]);

  // Derive unique values for filter dropdowns from already-fetched data
  const uniqueValues = useMemo<Record<string, string[]>>(() => {
    if (!fileData?.students || !fileData.file?.headers) return {};
    const result: Record<string, string[]> = {};
    fileData.file.headers.forEach(header => {
      const set = new Set<string>();
      fileData.students.forEach(student => {
        const val = student._rawData?.[header] ?? student[header as keyof Student];
        if (val !== null && val !== undefined && val !== '') {
          set.add(String(val).trim());
        }
      });
      result[header] = Array.from(set).sort();
    });
    return result;
  }, [fileData]);

  // Pre-calculate dropdown options for all headers, considering other active filters
  const filterOptions = useMemo<Record<string, string[]>>(() => {
    if (!fileData?.students || !fileData.file?.headers) return uniqueValues;
    const headers = fileData.file.headers;
    const students = fileData.students;
    
    const result: Record<string, string[]> = {};
    
    headers.forEach(targetHeader => {
      const otherFilters = Object.entries(filters).filter(([k, v]) => v && k !== targetHeader);
      
      if (otherFilters.length === 0) {
        result[targetHeader] = uniqueValues[targetHeader] || [];
        return;
      }

      const set = new Set<string>();
      students.forEach(student => {
        const matches = otherFilters.every(([k, v]) => {
          const studentValue = String(student._rawData?.[k] ?? student[k as keyof Student] ?? '');
          return studentValue === v;
        });
        if (matches) {
          const val = student._rawData?.[targetHeader] ?? student[targetHeader as keyof Student];
          if (val !== null && val !== undefined && val !== '') set.add(String(val).trim());
        }
      });
      result[targetHeader] = Array.from(set).sort();
    });
    
    return result;
  }, [fileData?.students, fileData?.file?.headers, filters, uniqueValues]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white border-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'completed_with_errors':
        return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white border-red-500"><AlertCircle className="w-3 h-3 mr-1" />With Errors</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">{status}</Badge>;
    }
  };

  // ── All hooks must be called before any early return ──────────────────────
  const filteredStudents = useMemo(() => {
    if (!fileData?.students) return [];
    let result = [...fileData.students];
    const file = fileData.file;

    if (Object.keys(filters).length > 0) {
      result = result.filter(student =>
        Object.entries(filters).every(([key, value]) => {
          const v = String(student._rawData?.[key] ?? student[key as keyof Student] ?? '');
          return v === value;
        })
      );
    }

    if (search.trim() !== '') {
      const term = search.trim().toLowerCase();
      result = result.filter(student => {
        if (String(student.studentId ?? '').toLowerCase().includes(term)) return true;
        return (file?.headers ?? []).some(header => {
          const v = String(student._rawData?.[header] ?? student[header as keyof Student] ?? '');
          return v.toLowerCase().includes(term);
        });
      });
    }

    return result;
  }, [fileData?.students, filters, search, fileData?.file?.headers]);

  const clientPagination = useMemo(() => {
    const total = filteredStudents.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, currentPage), pages);
    return { total, pages, page, limit: pageSize };
  }, [filteredStudents.length, pageSize, currentPage]);

  const paginatedStudents = useMemo(() => {
    const start = (clientPagination.page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, clientPagination.page, pageSize]);
  // ─────────────────────────────────────────────────────────────────────────

  const handleFilterChange = (header: string, value: string | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value && value !== '' && value !== 'ALL') {
        newFilters[header] = value;
      } else {
        delete newFilters[header];
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSearch('');
    setCurrentPage(1);
  };

  const renderCellValue = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // ── Early returns ──────────────────────────────────────────────────────────
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
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
            <Card className="p-8 text-center max-w-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <FileSpreadsheet className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Sign In Required</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please sign in to view file data.
              </p>
              <div className="space-x-2">
                <SignInButton mode="modal">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">Sign Up</Button>
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

  const { file } = fileData;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full flex items-center justify-start">
              <Button variant="outline" onClick={() => navigate('/files')} className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Files
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
                <FileSpreadsheet className="w-8 h-8 mr-3 text-green-600" />
                {file.filename}
              </h1>
              <div className="flex items-center justify-center space-x-4 mt-2">
                {getStatusBadge(file.status)}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {file.totalRecords} total • {file.processedRecords} processed
                  {file.failedRecords > 0 && ` • ${file.failedRecords} failed`}
                </span>
              </div>
            </div>
          </div>

        {/* Filters and Search */}
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Filter className="w-5 h-5 mr-2" />
              Filters and Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Global Search */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-3 h-4 w-4 ${searchTerm ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
                  <Input
                    placeholder="Search all fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${searchTerm ? 'border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  />
                  {searchTerm && (
                    <div className="absolute right-8 top-3 h-4 w-4 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSearch('');
                      }}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
                {search && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Searching for: "{search}"
                  </p>
                )}
              </div>
              
              {/* Column Filters */}
              {file?.headers && file.headers.length > 0 && file.headers.map(header => {
                // Get options that match current filters (pre-calculated for performance)
                const headerUniqueValues = filterOptions[header] || [];
                const currentValue = filters[header] || "ALL";
                
                return (
                  <div key={header}>
                    <Select
                      value={currentValue}
                      onValueChange={(value) => handleFilterChange(header, value === "ALL" ? undefined : value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder={`Filter by ${header}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 max-h-[300px] select-dropdown-content">
                        <SelectItem value="ALL" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">All {header}</SelectItem>
                        {headerUniqueValues.length === 0 ? (
                          <SelectItem value="NO_DATA" disabled className="text-gray-500 dark:text-gray-400">
                            No options available
                          </SelectItem>
                        ) : (
                          headerUniqueValues.map(value => {
                            const stringValue = String(value);
                            if (!stringValue || stringValue.trim() === '') return null;
                            return (
                              <SelectItem 
                                key={stringValue} 
                                value={stringValue}
                                className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                              >
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
                <Button variant="outline" onClick={clearFilters} className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <span>Data ({clientPagination.total} records)</span>
                  {(search || Object.keys(filters).length > 0) && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      Filtered
                    </Badge>
                  )}
                </CardTitle>
                {(search || Object.keys(filters).length > 0) && (
                  <div className="mt-1 space-y-1">
                    {search && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        🔍 Searching: "{search}"
                      </p>
                    )}
                    {Object.keys(filters).length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <SelectTrigger className="w-20 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <SelectItem value="25" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">25</SelectItem>
                    <SelectItem value="50" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">50</SelectItem>
                    <SelectItem value="100" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500 dark:text-gray-400">per page</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    {file?.headers && file.headers.map(header => (
                      <TableHead key={header} className="min-w-[150px] text-gray-900 dark:text-gray-100 font-medium">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.length === 0 ? (
                    <TableRow className="border-b border-gray-200 dark:border-gray-700">
                      <TableCell colSpan={file?.headers?.length || 0} className="text-center py-8 text-gray-900 dark:text-gray-100">
                        <div className="space-y-2">
                          <p>
                            {search || Object.keys(filters).length > 0
                              ? 'No data found matching your search criteria'
                              : 'No data found'
                            }
                          </p>
                          {search && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Searched for: "{search}"
                            </p>
                          )}
                          {Object.keys(filters).length > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Active filters: {Object.entries(filters).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStudents.map((student, index) => (
                      <TableRow key={student._id || index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        {file?.headers && file.headers.map(header => (
                          <TableCell key={header} className="text-gray-900 dark:text-gray-100">
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
            {clientPagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {((clientPagination.page - 1) * pageSize) + 1} to{' '}
                  {Math.min(clientPagination.page * pageSize, clientPagination.total)} of{' '}
                  {clientPagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={clientPagination.page <= 1}
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    Page {clientPagination.page} of {clientPagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(clientPagination.pages, p + 1))}
                    disabled={clientPagination.page >= clientPagination.pages}
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
