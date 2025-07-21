import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { OrderDispatchService } from '../../services/order-dispatch.service';
import { OrderState } from '../../store/order.reducer';
import { CartItemListComponent } from "../../../carts/components/cart-item-list/cart-item-list.component";
import { UserDispatchService } from '../../../users/services/user-dispatch.service';
import { OrderAuthComponent } from "../../components/order-auth/order-auth.component";
import { OrderSummaryComponent } from "../../components/order-summary/order-summary.component";
import { OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule, RouterModule, CartItemListComponent, OrderAuthComponent, OrderSummaryComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetail implements OnInit, OnDestroy {
  orderState?: OrderState;
  orderSubscription!: Subscription;
  userSubscription!: Subscription;
  orderNumber: string = "";

  constructor(
    private route: ActivatedRoute,
    private userDispatchService: UserDispatchService,
    private orderDispatchService: OrderDispatchService,
  ) { }

  get isPending() {
    return this.orderState?.order?.status === OrderStatus.PENDING;
  }

  ngOnInit(): void {
    this.subscribeNgRx();
    this.orderNumber = this.route.snapshot.queryParamMap.get("number") ?? "";
  }

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.orderSubscription = this.orderDispatchService.subscription.subscribe((state) => {
      this.orderState = state;
    });

    this.userSubscription = this.userDispatchService.subscription.subscribe((_) => {
      if (this.orderNumber && this.userDispatchService.hasAnActiveSession)
        this.orderDispatchService.getOrderByNumber(this.orderNumber);
    })
  }
}