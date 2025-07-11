import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout, map } from 'rxjs/operators';
import { API_TIMEOUT, API_RETRY_ATTEMPTS } from '../constants/api.constants';
import { ApiResponse, PaginatedApiResponse } from '../interfaces/api-response.interface';

export interface QueryParams {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, params?: QueryParams): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    const options = { params: httpParams };

    return this.http.get<ApiResponse<T>>(endpoint, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      map(response => this.extractData(response)),
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<ApiResponse<T>>(endpoint, body, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      map(response => this.extractData(response)),
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.put<ApiResponse<T>>(endpoint, body, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      map(response => this.extractData(response)),
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(endpoint).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      map(response => this.extractData(response)),
      catchError(this.handleError)
    );
  }

  // Raw response methods (when you need access to full ApiResponse)
  getRaw<T>(endpoint: string, params?: QueryParams): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const options = { params: httpParams };

    return this.http.get<ApiResponse<T>>(endpoint, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      catchError(this.handleError)
    );
  }

  postRaw<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(endpoint, body, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      catchError(this.handleError)
    );
  }

  // Paginated response method
  getPaginated<T>(endpoint: string, params?: QueryParams): Observable<PaginatedApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const options = { params: httpParams };

    return this.http.get<PaginatedApiResponse<T>>(endpoint, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      catchError(this.handleError)
    );
  }

  private extractData<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.message || 'Request failed');
    }
    return response.data;
  }

  private buildHttpParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => {
              httpParams = httpParams.append(key, item.toString());
            });
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    return httpParams;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'object') {
      // Server returned a structured error response
      const serverError = error.error as ApiResponse<any>;
      if (serverError.message) {
        errorMessage = serverError.message;
      } else if (serverError.error?.message) {
        errorMessage = serverError.error.message;
      }
    } else if (error.status) {
      // HTTP error with no structured response
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('API Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error,
      url: error.url
    });
    
    return throwError(() => new Error(errorMessage));
  }
}