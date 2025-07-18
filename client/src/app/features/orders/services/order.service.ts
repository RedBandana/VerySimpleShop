import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { IOrder } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly endpoint = 'orders';

  constructor(private apiService: ApiService) { }

  createOrderFromCart(cartId: string, shippingAddress: any): Observable<IOrder> {
    return this.apiService.post<IOrder>(`${this.endpoint}/from-cart/${cartId}`, { shippingAddress });
  }

  createCheckoutSession(): Observable<IOrder> {
    return this.apiService.post<IOrder>(`${this.endpoint}/users/me/checkout`, {});
  }

  getOrderByCartId(cartId: string): Observable<IOrder> {
    return this.apiService.get<IOrder>(`${this.endpoint}/cart/${cartId}`);
  }

  getOrder(orderId: string): Observable<IOrder> {
    return this.apiService.get<IOrder>(`${this.endpoint}/${orderId}`);
  }

  cancelOrder(orderId: string): Observable<IOrder> {
    return this.apiService.post<IOrder>(`${this.endpoint}/${orderId}/cancel`, {});
  }
}