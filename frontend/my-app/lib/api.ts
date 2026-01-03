import axios from 'axios';

// API base URL - using relative path to support proxying (Next.js rewrites / Netlify redirects)
const API_BASE_URL = '/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for HttpOnly cookies
});

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export interface LoginResponse {
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth API functions
export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Register new user
   */
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
  }): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', userData);
    return response.data.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Get current user from server (via cookie)
   */
  getMe: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
      return response.data.data.user;
    } catch (error) {
      return null;
    }
  },
};

// Article Types
export interface Article {
  id: string;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ArticleResponse {
  articles: Article[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Article API functions
export const articleApi = {
  getAll: async (page = 1, limit = 10, status?: string) => {
    const params = { page, limit, status };
    const response = await apiClient.get<{ data: ArticleResponse }>('/articles', { params });
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Article }>(`/articles/${id}`);
    return response.data.data;
  },

  create: async (data: { title: string; content: string; status: 'DRAFT' | 'PUBLISHED' }) => {
    const response = await apiClient.post<{ data: Article }>('/articles', data);
    return response.data.data;
  },

  update: async (id: string, data: { title?: string; content?: string; status?: 'DRAFT' | 'PUBLISHED' }) => {
    const response = await apiClient.put<{ data: Article }>(`/articles/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/articles/${id}`);
  },
};
