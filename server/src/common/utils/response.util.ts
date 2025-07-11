import { HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiError, PaginatedApiResponse } from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(
    data: T,
    message = 'Success',
    status = HttpStatus.OK,
    meta?: Record<string, any>
  ): ApiResponse<T> {
    return {
      data,
      status,
      message,
      success: true,
      timestamp: new Date().toISOString(),
      ...(meta && { meta })
    };
  }

  static error(
    message: string,
    code = 'INTERNAL_ERROR',
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: any,
    path?: string
  ): ApiResponse<null> {
    return {
      data: null,
      status,
      message,
      success: false,
      timestamp: new Date().toISOString(),
      ...(path && { path }),
      error: {
        code,
        message,
        ...(details && { details })
      }
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = 'Success',
    status = HttpStatus.OK,
    meta?: Record<string, any>
  ): PaginatedApiResponse<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      status,
      message,
      success: true,
      timestamp: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      },
      ...(meta && { meta })
    };
  }
}