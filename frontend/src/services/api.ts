const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface Student {
  _id?: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  program: string;
  year: number;
  semester: 'Fall' | 'Spring' | 'Summer';
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
  createdBy: string;
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
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
  duplicates: Array<{
    row: number;
    studentId: string;
    email: string;
    message: string;
  }>;
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
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
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
  async uploadExcel(file: File, createdBy: string): Promise<{ message: string; results: UploadResult }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('createdBy', createdBy);

    return this.request('/upload/excel', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async validateExcel(file: File): Promise<{ message: string; validation: any }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload/validate', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
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
