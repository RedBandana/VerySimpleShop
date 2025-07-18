import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ICart } from '../models/cart.model';
import { IAddToCartRequest, IRemoveFromCartRequest, IUpdateCartRequest } from '../models/cart-request.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly endpoint = 'carts';

  constructor(private apiService: ApiService) { }

  getMyCart(): Observable<ICart> {
    return this.apiService.get<ICart>(`${this.endpoint}/users/me`);
  }

  addToCart(request: IAddToCartRequest): Observable<ICart> {
    return this.apiService.post<ICart>(`${this.endpoint}/users/me/add`, request);
  }

  updateCartItem(request: IUpdateCartRequest): Observable<ICart> {
    return this.apiService.put<ICart>(`${this.endpoint}/users/me/update`, request);
  }

  removeFromCart(request: IRemoveFromCartRequest): Observable<ICart> {
    return this.apiService.post<ICart>(`${this.endpoint}/users/me/remove`, request);
  }

  clearCart(): Observable<ICart> {
    return this.apiService.delete<ICart>(`${this.endpoint}/users/me/clear`);
  }
}