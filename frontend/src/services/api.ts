// Declare Clerk type
declare global {
  interface Window {
    Clerk: {
      session?: {
        getToken: () => Promise<string>;
      };
    };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface Student {
  _id?: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  program?: string;
  year?: number;
  semester?: 'Fall' | 'Spring' | 'Summer';
  gpa?: number;
  credits?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  status?: 'Active' | 'Inactive' | 'Graduated' | 'Suspended' | 'Withdrawn';
  courses?: Array<{
    courseId?: string;
    courseName?: string;
    grade?: string;
    credits?: number;
    semester?: string;
    year?: number;
  }>;
  customFields?: Record<string, any>;
  // Raw data from Excel file (dynamic columns)
  _rawData?: Record<string, any>;
  // Metadata
  uploadId?: string;
  rowNumber?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
}

export interface StudentsResponse {
  students: Student[];
  totalPages: number;
  currentPage: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UploadResult {
  success: boolean;
  message: string;
  uploadId: string;
  stats: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

// API Service Class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    let response: Response;
    
    try {
      // Get the Clerk session token if available
      let token = '';
      try {
        token = (await window.Clerk?.session?.getToken()) || '';
      } catch (tokenError) {
        console.warn('Could not get Clerk token:', tokenError);
        // Continue without token - this will cause auth error if auth is required
      }
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      };
      
      // Log request for debugging
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      response = await fetch(url, config);
      
      // Handle non-2xx responses
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorDetails: any = null;
        
        try {
          // Try to parse error response as JSON
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorDetails = errorData;
        } catch (e) {
          // If we can't parse JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.details = errorDetails;
        
        // Handle specific HTTP status codes
        if (response.status === 401) {
          error.message = 'Authentication required. Please sign in again.';
        } else if (response.status === 403) {
          error.message = 'You do not have permission to perform this action.';
        } else if (response.status === 404) {
          error.message = 'The requested resource was not found.';
        } else if (response.status >= 500) {
          error.message = 'A server error occurred. Please try again later.';
        }
        
        throw error;
      }
      
      // For 204 No Content responses, return null
      if (response.status === 204) {
        return null as unknown as T;
      }
      
      // Parse and return the JSON response
      return await response.json();
    } catch (error: any) {
      console.error('API request failed:', {
        url,
        method: options.method || 'GET',
        status: response?.status,
        error: error.message,
        details: error.details || 'No additional details',
      });
      
      // Enhance the error with more context
      if (!(error instanceof Error)) {
        error = new Error(String(error));
      }
      
      // Add additional context to the error
      (error as any).isApiError = true;
      (error as any).endpoint = endpoint;
      (error as any).status = (error as any).status || 0;
      
      // Re-throw the enhanced error
      throw error;
    }
  }

  // Health Check
  async healthCheck() {
    return this.request<{ status: string; message: string; database: string }>('/health');
  }

  // Student CRUD Operations
  async getStudents(params: {
    page?: number;
    limit?: number;
    search?: string;
    program?: string;
    year?: number;
    semester?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<StudentsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/students${queryString ? `?${queryString}` : ''}`;
    
    return this.request<StudentsResponse>(endpoint);
  }

  async getStudent(id: string): Promise<Student> {
    return this.request<Student>(`/students/${id}`);
  }

  async createStudent(student: Omit<Student, '_id' | 'createdAt' | 'updatedAt' | 'fullName'>): Promise<Student> {
    return this.request<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    return this.request<Student>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    });
  }

  async deleteStudent(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  async getStudentStats(): Promise<{
    totalStudents: number;
    activeStudents: number;
    programStats: Array<{ _id: string; count: number }>;
    yearStats: Array<{ _id: number; count: number }>;
    averageGPA: number;
  }> {
    return this.request('/students/stats/overview');
  }

  // File Upload Operations
  async validateExcel(file: File): Promise<{ message: string; validation: any }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload/validate', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  // Get upload statistics
  async getUploadStats(): Promise<{ totalUploads: number; lastUpload: string | null }> {
    const response = await this.request<{
      success: boolean;
      totalUploads: number;
      lastUpload: string | null;
      message?: string;
    }>('/upload/stats');
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch upload stats');
    }
    
    return {
      totalUploads: response.totalUploads || 0,
      lastUpload: response.lastUpload || null
    };
  }

  // Upload Excel file
  async uploadExcel(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Get the Clerk session token
    const token = await window.Clerk?.session?.getToken() || '';
    
    try {
      const response = await fetch(`${this.baseUrl}/upload/excel`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If we can't parse the error response, throw with status text
          throw new Error(response.statusText || 'Upload failed');
        }
        throw new Error(errorData.message || 'Upload failed');
      }

      return await response.json() as UploadResult;
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get uploaded files for a user
  async getUploadedFiles(): Promise<{
    success: boolean;
    files: Array<{
      _id: string;
      filename: string;
      size: number;
      status: string;
      totalRecords: number;
      processedRecords: number;
      failedRecords: number;
      createdAt: string;
      completedAt?: string;
    }>;
  }> {
    const response = await this.request<{
      success: boolean;
      files: Array<{
        _id: string;
        filename: string;
        size: number;
        status: string;
        totalRecords: number;
        processedRecords: number;
        failedRecords: number;
        createdAt: string;
        completedAt?: string;
      }>;
      message?: string;
    }>('/upload/files');
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch uploaded files');
    }
    
    return response;
  }

  // Get data for a specific uploaded file
  async getFileData(fileId: string, params: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
  } = {}): Promise<{
    success: boolean;
    data: {
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
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.search && params.search.trim() !== '') {
      queryParams.set('search', params.search.trim());
    }
    if (params.filters && Object.keys(params.filters).length > 0) {
      queryParams.set('filters', JSON.stringify(params.filters));
    }
    
    const endpoint = `/upload/files/${fileId}/data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await this.request<{
      success: boolean;
      data: {
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
      };
      message?: string;
    }>(endpoint);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch file data');
    }
    
    return response;
  }

  // Get error details for a specific file
  async getFileErrors(fileId: string): Promise<{
    success: boolean;
    errors: Array<{
      row: number;
      error: string;
      data: any;
    }>;
    totalErrors: number;
    failedRecords: number;
    processedRecords: number;
    totalRecords: number;
  }> {
    const response = await this.request<{
      success: boolean;
      errors: Array<{
        row: number;
        error: string;
        data: any;
      }>;
      totalErrors: number;
      failedRecords: number;
      processedRecords: number;
      totalRecords: number;
      message?: string;
    }>(`/upload/files/${fileId}/errors`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch file errors');
    }
    
    return response;
  }

  // Get columns information for a specific file
  async getFileColumns(fileId: string): Promise<{
    success: boolean;
    columns: Array<{
      name: string;
      type: string;
      sampleValue: any;
    }>;
    totalColumns: number;
  }> {
    const response = await this.request<{
      success: boolean;
      columns: Array<{
        name: string;
        type: string;
        sampleValue: any;
      }>;
      totalColumns: number;
      message?: string;
    }>(`/upload/files/${fileId}/columns`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch file columns');
    }
    
    return response;
  }

  // Get unique values for all columns in a file
  async getFileUniqueValues(fileId: string): Promise<{
    success: boolean;
    uniqueValues: Record<string, any[]>;
    totalColumns: number;
  }> {
    const response = await this.request<{
      success: boolean;
      uniqueValues: Record<string, any[]>;
      totalColumns: number;
      message?: string;
    }>(`/upload/files/${fileId}/unique-values`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch unique values');
    }
    
    return response;
  }

  // Get unique values for all columns in a file, filtered by current selections
  async getFilteredUniqueValues(fileId: string, filters: Record<string, string> = {}): Promise<{
    success: boolean;
    uniqueValues: Record<string, any[]>;
    totalColumns: number;
    matchingRecords: number;
  }> {
    const queryParams = new URLSearchParams();
    if (Object.keys(filters).length > 0) {
      queryParams.set('filters', JSON.stringify(filters));
    }
    
    const response = await this.request<{
      success: boolean;
      uniqueValues: Record<string, any[]>;
      totalColumns: number;
      matchingRecords: number;
      message?: string;
    }>(`/upload/files/${fileId}/filtered-unique-values?${queryParams.toString()}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch filtered unique values');
    }
    
    return response;
  }

  // Delete an uploaded file and all its data
  async deleteFile(fileId: string): Promise<{
    success: boolean;
    message: string;
    deletedRecords?: number;
  }> {
    const response = await this.request<{
      success: boolean;
      message: string;
      deletedRecords?: number;
    }>(`/upload/files/${fileId}`, {
      method: 'DELETE'
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete file');
    }
    
    return response;
  }

  async downloadTemplate(): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/upload/template`);
    
    if (!response.ok) {
      throw new Error('Failed to download template');
    }

    return response.blob();
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual functions for easier use
export const {
  healthCheck,
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
  uploadExcel,
  validateExcel,
  downloadTemplate,
} = apiService;
