import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { OrderDispatchService } from '../../services/order-dispatch.service';
import { OrderState } from '../../store/order.reducer';
import { IOrder } from '../../models/order.model';
import { CartItemListComponent } from "../../../carts/components/cart-item-list/cart-item-list.component";

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterModule, CartItemListComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetail implements OnInit, OnDestroy {
  orderState?: OrderState;
  orderSubscription!: Subscription;
  error: string = "";

  constructor(
    private route: ActivatedRoute,
    private orderDispatchService: OrderDispatchService,
  ) { }

  get order(): IOrder | undefined {
    return this.orderState?.order;
  }

  get shippingAddress() {
    if (!this.order?.shippingDetails?.address) return "";

    const { line1, line2, city, state, postalCode, country } = this.order.shippingDetails.address;
    const address = `${line1},${line2 ? ` ${line2}` : ``} ${city}, ${state}, ${postalCode}, ${country}`;
    return address;
  }

  ngOnInit(): void {
    this.subscribeNgRx();

    this.route.paramMap.pipe(
      map(params => params.get('number'))
    ).subscribe(orderNumber => {
      if (orderNumber)
        this.orderDispatchService.getOrderByNumber(orderNumber);
    });
  }

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.orderSubscription = this.orderDispatchService.subscription.subscribe((state) => {
      this.orderState = state;

      if (state.error !== "Unauthorized")
        this.error = state.error ?? "";
    });
  }
}