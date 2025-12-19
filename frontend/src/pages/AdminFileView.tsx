import Layout from "@/components/Layout/Layout";
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
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";

// Reuse the interface from regular FileView
interface Student {
    _id: string;
    studentId?: string;
    _rawData: any;
    [key: string]: any;
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

const AdminFileView = () => {
    const { fileId } = useParams<{ fileId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

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

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

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

        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: pageSize.toString(),
            });

            if (debouncedSearch) queryParams.append('search', debouncedSearch);
            if (Object.keys(filters).length > 0) queryParams.append('filters', JSON.stringify(filters));

            const response = await fetch(`http://localhost:5000/api/admin/files/${fileId}/data?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                setFileData(result.data);
            } else {
                throw new Error(result.message || 'Failed to load file data');
            }

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
    }, [fileId, currentPage, pageSize, debouncedSearch, filters, navigate, toast]);

    useEffect(() => {
        fetchFileData();
    }, [fetchFileData]);

    // Fetch unique values for filter dropdowns
    const fetchUniqueValues = useCallback(async () => {
        if (!fileId) return;

        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            setIsLoadingUniqueValues(true);
            const response = await fetch(`http://localhost:5000/api/admin/files/${fileId}/unique-values`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (response.ok && result.uniqueValues) {
                setUniqueValues(result.uniqueValues);
            }
        } catch (error) {
            console.error('Error fetching unique values', error);
            // Fallback logic could go here if needed
        } finally {
            setIsLoadingUniqueValues(false);
        }
    }, [fileId]);

    useEffect(() => {
        fetchUniqueValues();
    }, [fetchUniqueValues]);


    const getFilteredUniqueValues = useCallback((targetHeader: string) => {
        // Simple version: just return all unique values for the header
        // The complex dependent filtering from FileView is nice but let's start simple for Admin
        // unless we want to copy that logic too.
        return uniqueValues[targetHeader] || [];
    }, [uniqueValues]);

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
        setSearch('');
        setCurrentPage(1);
    };

    const renderCellValue = (value: any) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !fileData) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
                <Card className="p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading File</h3>
                    <p className="text-gray-600 mb-4">{error || 'File not found'}</p>
                    <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
                </Card>
            </div>
        );
    }

    const { file, students, pagination } = fileData;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="container mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full flex items-center justify-start">
                        <Button variant="outline" onClick={() => navigate('/admin/dashboard')} className="border-gray-300">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Dashboard
                        </Button>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
                            <FileSpreadsheet className="w-8 h-8 mr-3 text-green-600" />
                            {file.filename}
                        </h1>
                        <div className="flex items-center justify-center space-x-4 mt-2">
                            {getStatusBadge(file.status)}
                            <span className="text-sm text-gray-500">
                                {file.totalRecords} total • {file.processedRecords} processed
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="w-5 h-5 mr-2" />
                            Filters and Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-2 lg:col-span-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search all fields..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch('')}
                                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Column Filters */}
                            {file?.headers && file.headers.length > 0 && file.headers.map(header => {
                                const headerUniqueValues = getFilteredUniqueValues(header);
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
                                            <SelectContent className="max-h-[300px]">
                                                <SelectItem value="ALL">All {header}</SelectItem>
                                                {headerUniqueValues.map(value => {
                                                    const stringValue = String(value);
                                                    if (!stringValue || stringValue.trim() === '') return null;
                                                    return (
                                                        <SelectItem key={stringValue} value={stringValue}>
                                                            {stringValue}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                );
                            })}

                            <div className="flex items-end">
                                <Button variant="outline" onClick={clearFilters} className="w-full">
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Data ({pagination.total} records)</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) => setPageSize(Number(value))}
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
                            <Table className="min-w-[max-content]">
                                <TableHeader>
                                    <TableRow>
                                        {file?.headers && file.headers.map(header => (
                                            <TableHead key={header} className="min-w-[150px] whitespace-nowrap">
                                                {header}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student, index) => (
                                        <TableRow key={student._id || index}>
                                            {file?.headers && file.headers.map(header => (
                                                <TableCell key={header} className="whitespace-nowrap">
                                                    {renderCellValue(student._rawData?.[header] || student[header as keyof Student])}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    Page {pagination.page} of {pagination.pages}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage >= pagination.pages}
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default AdminFileView;
