export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
  success: boolean;
  timestamp: string;
  path?: string;
  error?: ApiError;
  meta?: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiResponseBuilder {
  success<T>(data: T, message?: string, meta?: Record<string, any>): ApiResponse<T>;
  error(message: string, code?: string, details?: any, status?: number): ApiResponse<null>;
  paginated<T>(
    data: T[],
    pagination: PaginatedApiResponse<T>['pagination'],
    message?: string,
    meta?: Record<string, any>
  ): PaginatedApiResponse<T>;
}