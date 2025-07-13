import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { OrderService } from '../../services/order.service';
import { IOrder } from '../../models/order.model';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccess implements OnInit {
  order$: Observable<IOrder | null> = of(null);
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Get order ID from query parameters (usually passed by Stripe)
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    
    if (orderId) {
      this.loadOrder(orderId);
    } else if (sessionId) {
      // If we have a session ID, we might need to look up the order differently
      // For now, show success without order details
      this.isLoading = false;
    } else {
      this.isLoading = false;
    }
  }

  private loadOrder(orderId: string): void {
    this.order$ = this.orderService.getOrder(orderId).pipe(
      map(response => response?.data || null),
      catchError(error => {
        this.error = 'Failed to load order details';
        this.isLoading = false;
        return of(null);
      })
    );
    
    this.order$.subscribe(() => {
      this.isLoading = false;
    });
  }
}