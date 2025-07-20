import { ApiResponse, PaginatedApiResponse } from '../interfaces/api-response.interface';

export class ResponseUtils {
  static isSuccess<T>(response: ApiResponse<T>): boolean {
    return response.success;
  }

  static hasError<T>(response: ApiResponse<T>): boolean {
    return !response.success;
  }

  static getData<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.message || 'Request failed');
    }
    return response.data;
  }

  static getMessage<T>(response: ApiResponse<T>): string {
    return response.message || '';
  }

  static getErrorMessage<T>(response: ApiResponse<T>): string {
    return response.error?.message || response.message || 'Unknown error';
  }

  static isPaginated<T>(response: ApiResponse<T> | PaginatedApiResponse<T>): response is PaginatedApiResponse<T> {
    return 'pagination' in response;
  }

  static getPaginationInfo<T>(response: PaginatedApiResponse<T>) {
    return response.pagination;
  }
}