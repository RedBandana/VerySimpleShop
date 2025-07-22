import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { IUser } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint = 'users';

  constructor(private apiService: ApiService) { }

  getMe(): Observable<IUser> {
    return this.apiService.get<IUser>(`${this.endpoint}/me`);
  }
}
