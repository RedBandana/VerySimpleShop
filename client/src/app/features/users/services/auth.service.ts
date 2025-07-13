import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { IAuthResponse, IUser } from '../models/user.model';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoint = 'auth';
  private userSubject = new BehaviorSubject<IUser | null>(null);
  private sessionInitialized = false;

  // Public observables
  user$ = this.userSubject.asObservable();

  get currentUser(): IUser | null {
    return this.userSubject.value;
  }

  constructor(private apiService: ApiService) { }

  login(credentials: LoginRequest): Observable<ApiResponse<IAuthResponse>> {
    return this.apiService.post<ApiResponse<IAuthResponse>>(`${this.endpoint}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.userSubject.next(response.data.user);
          this.sessionInitialized = true;
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<IAuthResponse>> {
    return this.apiService.post<ApiResponse<IAuthResponse>>(`${this.endpoint}/register`, userData);
  }

  createGuestSession(): Observable<ApiResponse<IAuthResponse>> {
    return this.apiService.post<ApiResponse<IAuthResponse>>(`${this.endpoint}/guest`, {}).pipe(
      tap(response => {
        if (response.success) {
          this.userSubject.next(response.data.user);
          this.sessionInitialized = true;
        }
      })
    );
  }

  logout(): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(`${this.endpoint}/logout`, {}).pipe(
      tap(response => {
        if (response.success) {
          this.userSubject.next(null);
          this.sessionInitialized = false;
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isGuest(): boolean {
    return this.currentUser?.isGuest || false;
  }

  isAdmin(): boolean {
    return this.currentUser?.permissions?.includes('admin') || false;
  }

  isSessionInitialized(): boolean {
    return this.sessionInitialized;
  }

  ensureGuestSession(): Observable<ApiResponse<IAuthResponse>> {
    if (!this.isLoggedIn()) {
      return this.createGuestSession();
    }
    return new Observable(subscriber => {
      subscriber.next({
        success: true,
        data: { user: this.currentUser! },
        message: 'Session already exists',
        status: 200,
        timestamp: new Date().toISOString()
      });
      subscriber.complete();
    });
  }
}
