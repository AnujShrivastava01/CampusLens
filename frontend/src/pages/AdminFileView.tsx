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
import { useCallback, useEffect, useMemo, useState } from "react";
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

        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const queryParams = new URLSearchParams({
                page: '1',
                limit: '100000', // Fetch max records for client side filtering
            });

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/admin/files/${fileId}/data?${queryParams.toString()}`, {
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
    }, [fileId, navigate, toast]);

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
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/admin/files/${fileId}/unique-values`, {
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
        setSearchTerm('');
        setSearch('');
        setCurrentPage(1);
    };

    const renderCellValue = (value: any) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    // ── All hooks must be called before any early return ──────────────────────
    const fileHeaders = fileData?.file?.headers ?? [];

    const { filteredStudents, clientPagination } = useMemo(() => {
        const students = fileData?.students ?? [];
        let filtered = [...students];

        if (Object.keys(filters).length > 0) {
            filtered = filtered.filter(student =>
                Object.entries(filters).every(([key, value]) => {
                    const v = String(student._rawData?.[key] ?? student[key as keyof Student] ?? '');
                    return v === value;
                })
            );
        }

        if (search.trim() !== '') {
            const term = search.trim().toLowerCase();
            filtered = filtered.filter(student => {
                if (String(student.studentId ?? '').toLowerCase().includes(term)) return true;
                return fileHeaders.some(header => {
                    const v = String(student._rawData?.[header] ?? student[header as keyof Student] ?? '');
                    return v.toLowerCase().includes(term);
                });
            });
        }

        const total = filtered.length;
        const pages = Math.max(1, Math.ceil(total / pageSize));
        const page = Math.min(Math.max(1, currentPage), pages);
        return { filteredStudents: filtered, clientPagination: { total, pages, page, limit: pageSize } };
    }, [fileData?.students, search, filters, currentPage, pageSize, fileHeaders]);

    const paginatedStudents = useMemo(() => {
        const start = (clientPagination.page - 1) * pageSize;
        return filteredStudents.slice(start, start + pageSize);
    }, [filteredStudents, clientPagination.page, pageSize]);
    // ─────────────────────────────────────────────────────────────────────────

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

    const { file } = fileData;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-24">
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSearch('');
                                            }}
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
                            <CardTitle>Data ({clientPagination.total} records)</CardTitle>
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
                                    {paginatedStudents.map((student, index) => (
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
                        {clientPagination.pages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-500">
                                    Page {clientPagination.page} of {clientPagination.pages}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={clientPagination.page <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(clientPagination.pages, prev + 1))}
                                        disabled={clientPagination.page >= clientPagination.pages}
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
