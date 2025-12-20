import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Trash2, Upload, LogOut, FileText } from 'lucide-react';

interface AdminFile {
    _id: string;
    filename: string;
    status: string;
    totalRecords: number;
    processedRecords: number;
    failedRecords: number;
    createdAt: string;
}

const AdminDashboard = () => {
    const [files, setFiles] = useState<AdminFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchFiles();
    }, [navigate]);

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/admin/files`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setFiles(data.files);
            } else {
                if (response.status === 401) {
                    handleLogout();
                } else {
                    toast.error(data.message || 'Failed to fetch files');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching files');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin/login');
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/admin/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('File uploaded successfully');
                fetchFiles();
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error uploading file');
        } finally {
            setUploading(false);
            // Reset input
            event.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this file and all its records?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/admin/files/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('File deleted');
                setFiles(files.filter(f => f._id !== id));
            } else {
                const data = await response.json();
                toast.error(data.message || 'Delete failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting file');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
            <div className="container mx-auto p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <span>Manage Files</span>
                            <div className="w-full sm:w-auto">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <Button asChild disabled={uploading} className="w-full sm:w-auto">
                                    <label htmlFor="file-upload" className="cursor-pointer flex justify-center items-center gap-2">
                                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                        {uploading ? 'Uploading...' : 'Upload Excel'}
                                    </label>
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : files.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">
                                No files uploaded yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-md border">
                                <Table className="min-w-[800px]">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Filename</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Records</TableHead>
                                            <TableHead className="hidden md:table-cell">Upload Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {files.map((file) => (
                                            <TableRow key={file._id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                                                        <span className="truncate max-w-[150px] sm:max-w-[200px]" title={file.filename}>
                                                            {file.filename}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${file.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        file.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {file.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs whitespace-nowrap space-y-0.5">
                                                        <div>Total: {file.totalRecords}</div>
                                                        <div className="text-green-600">Processed: {file.processedRecords}</div>
                                                        <div className="text-red-600">Failed: {file.failedRecords}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell whitespace-nowrap">
                                                    {new Date(file.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right whitespace-nowrap">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-1"
                                                        onClick={() => navigate(`/admin/files/${file._id}`)}
                                                        title="View Data"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(file._id)}
                                                        title="Delete File"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
