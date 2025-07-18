import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderDispatchService } from '../../services/order-dispatch.service';
import { OrderState } from '../../store/order.reducer';
import { IOrder } from '../../models/order.model';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccess implements OnInit, OnDestroy {
  orderState?: OrderState;
  orderSubscription!: Subscription;

  get order(): IOrder | undefined {
    return this.orderState?.order;
  }

  constructor(
    private route: ActivatedRoute,
    private orderDispatchService: OrderDispatchService
  ) { }

  ngOnInit(): void {
    this.subscribeNgRx();

    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId)
      this.orderDispatchService.getOrder(orderId);
  }

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.orderSubscription = this.orderDispatchService.subscription.subscribe((state) => {
      this.orderState = state;
    });
  }
}