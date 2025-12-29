// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper used by all backend endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Error response structure from the backend
 */
export interface ApiError {
  message: string;
  code?: string;
  unverified?: boolean;
  email?: string;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
