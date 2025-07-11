import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoint = 'auth';

  constructor(private apiService: ApiService) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(`${this.endpoint}/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(`${this.endpoint}/register`, userData);
  }

  createGuestSession(): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(`${this.endpoint}/guest`, {});
  }

  logout(): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/logout`, {});
  }

  isLoggedIn(): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }
}
