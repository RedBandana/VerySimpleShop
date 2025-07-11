import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ResponseUtil } from '../utils/response.util';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => {
        // If data is already in ApiResponse format, return as is
        if (data && typeof data === 'object' && 'success' in data && 'timestamp' in data) {
          return data;
        }

        // Get the status code from the response
        const status = response.statusCode || HttpStatus.OK;
        
        // Create standardized response
        return ResponseUtil.success(
          data,
          'Success',
          status,
          {
            requestId: request.headers['x-request-id'] || undefined,
            path: request.url
          }
        );
      })
    );
  }
}