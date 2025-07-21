import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderState } from '../../store/order.reducer';
import { Subscription } from 'rxjs';
import { OrderDispatchService } from '../../services/order-dispatch.service';

@Component({
  selector: 'app-order-auth',
  imports: [FormsModule],
  templateUrl: './order-auth.component.html',
  styleUrl: './order-auth.component.scss'
})
export class OrderAuthComponent implements OnInit, OnDestroy {
  @Input() orderNumber: string = "";
  postalCode: string = "";

  orderState?: OrderState;
  orderSubscription!: Subscription;

  constructor(
    private orderDispatchService: OrderDispatchService,
  ) { }

  ngOnInit(): void {
    this.subscribeNgRx();
  }

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.orderSubscription = this.orderDispatchService.subscription.subscribe((state) => {
      this.orderState = state;
    });
  }

  authOrder() {
    if (!this.orderNumber || !this.postalCode) return;
    this.orderDispatchService.getOrderByAuth({
      orderNumber: this.orderNumber,
      postalCode: this.postalCode
    });
  }
}
