/**
 * User type definition
 */
export interface User {
  id: string;
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImageUrl?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLoginAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API Error response
 */
export interface ApiError {
  status: 'error';
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * User update data
 */
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImageUrl?: string;
  metadata?: Record<string, unknown>;
}
