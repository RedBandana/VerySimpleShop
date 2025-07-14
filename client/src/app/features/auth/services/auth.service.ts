import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { IAuthResponse, ILoginRequest, IRegisterRequest } from '../models/auth-request.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoint = 'auth';

  constructor(private apiService: ApiService) { }

  createGuestSession(): Observable<IAuthResponse> {
    return this.apiService.post<IAuthResponse>(`${this.endpoint}/guest`, {});
  }

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return this.apiService.post<IAuthResponse>(`${this.endpoint}/login`, credentials);
  }

  register(userData: IRegisterRequest): Observable<IAuthResponse> {
    return this.apiService.post<IAuthResponse>(`${this.endpoint}/register`, userData);
  }

  logout(): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(`${this.endpoint}/logout`, {});
  }
}
