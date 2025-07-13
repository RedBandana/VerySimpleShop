import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ICart, IAddToCartRequest, IUpdateCartRequest, IRemoveFromCartRequest } from '../models/cart.model';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly endpoint = 'carts';

  constructor(private apiService: ApiService) { }

  getMyCart(): Observable<ApiResponse<ICart>> {
    return this.apiService.get<ApiResponse<ICart>>(`${this.endpoint}/users/me`);
  }

  addToCart(request: IAddToCartRequest): Observable<ApiResponse<ICart>> {
    return this.apiService.post<ApiResponse<ICart>>(`${this.endpoint}/users/me/add`, request);
  }

  updateCartItem(request: IUpdateCartRequest): Observable<ApiResponse<ICart>> {
    return this.apiService.put<ApiResponse<ICart>>(`${this.endpoint}/users/me/update`, request);
  }

  removeFromCart(request: IRemoveFromCartRequest): Observable<ApiResponse<ICart>> {
    return this.apiService.post<ApiResponse<ICart>>(`${this.endpoint}/users/me/remove`, request);
  }

  clearCart(): Observable<ApiResponse<ICart>> {
    return this.apiService.delete<ApiResponse<ICart>>(`${this.endpoint}/users/me/clear`);
  }
}