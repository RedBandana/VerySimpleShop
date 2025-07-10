import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { API_TIMEOUT, API_RETRY_ATTEMPTS } from '../constants/api.constants';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface QueryParams {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, params?: QueryParams): Observable<ApiResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const options = { params: httpParams };

    return this.http.get<ApiResponse<T>>(endpoint, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(endpoint, body, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(endpoint, body, options).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(endpoint).pipe(
      retry(API_RETRY_ATTEMPTS),
      timeout(API_TIMEOUT),
      catchError(this.handleError)
    );
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

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;

      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}