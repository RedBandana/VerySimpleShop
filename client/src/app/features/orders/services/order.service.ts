import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { IOrder, ICreateOrderRequest, ICheckoutSessionResponse } from '../models/order.model';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly endpoint = 'orders';

  constructor(private apiService: ApiService) { }

  createOrderFromCart(cartId: string, shippingAddress: any): Observable<ApiResponse<IOrder>> {
    return this.apiService.post<ApiResponse<IOrder>>(`${this.endpoint}/from-cart/${cartId}`, { shippingAddress });
  }

  createCheckoutSession(): Observable<ApiResponse<ICheckoutSessionResponse>> {
    return this.apiService.post<ApiResponse<ICheckoutSessionResponse>>(`${this.endpoint}/users/me/checkout`, {});
  }

  getOrderByCartId(cartId: string): Observable<ApiResponse<IOrder>> {
    return this.apiService.get<ApiResponse<IOrder>>(`${this.endpoint}/cart/${cartId}`);
  }

  getOrder(orderId: string): Observable<ApiResponse<IOrder>> {
    return this.apiService.get<ApiResponse<IOrder>>(`${this.endpoint}/${orderId}`);
  }

  cancelOrder(orderId: string): Observable<ApiResponse<IOrder>> {
    return this.apiService.post<ApiResponse<IOrder>>(`${this.endpoint}/${orderId}/cancel`, {});
  }
}