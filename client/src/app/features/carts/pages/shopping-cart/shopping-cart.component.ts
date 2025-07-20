import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CartState } from '../../store/cart.reducer';
import { Subscription } from 'rxjs';
import { CartDispatchService } from '../../services/cart-dispatch.service';
import { OrderDispatchService } from '../../../orders/services/order-dispatch.service';
import { OrderState } from '../../../orders/store/order.reducer';
import { CartItemListComponent } from "../../components/cart-item-list/cart-item-list.component";

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, RouterModule, CartItemListComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCart implements OnInit, OnDestroy {

  cartState?: CartState;
  cartSubscription!: Subscription;

  orderState?: OrderState;
  orderSubscription!: Subscription;

  constructor(
    private cartDispatchService: CartDispatchService,
    private orderDispatchService: OrderDispatchService,
  ) {
  }

  get hasAnyItem() {
    return this.cartState?.cart?.items?.length ?? 0 > 0;
  }

  ngOnInit(): void {
    this.subscribeNgRx();
    this.orderDispatchService.resetOrderError();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.orderSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.cartSubscription = this.cartDispatchService.subscription.subscribe((state) => {
      this.cartState = state;
    });

    this.orderSubscription = this.orderDispatchService.subscription.subscribe((state) => {
      this.orderState = state;
    })
  }
}