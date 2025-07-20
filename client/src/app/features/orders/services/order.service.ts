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

  createOrderFromCart(cartId: string): Observable<IOrder> {
    return this.apiService.post<IOrder>(`${this.endpoint}/from-cart/${cartId}`);
  }

  createCheckoutSession(): Observable<IOrder> {
    return this.apiService.post<IOrder>(`${this.endpoint}/users/me/checkout`, {});
  }

  getOrder(orderId: string): Observable<IOrder> {
    return this.apiService.get<IOrder>(`${this.endpoint}/${orderId}`);
  }

  getOrderByCartId(cartId: string): Observable<IOrder> {
    return this.apiService.get<IOrder>(`${this.endpoint}/cart/${cartId}`);
  }

  getOrderByNumber(orderNumber: string): Observable<IOrder> {
    return this.apiService.get<IOrder>(`${this.endpoint}/number/${orderNumber}`);
  }

  cancelOrder(orderId: string): Observable<IOrder> {
    return this.apiService.post<IOrder>(`${this.endpoint}/${orderId}/cancel`, {});
  }
}