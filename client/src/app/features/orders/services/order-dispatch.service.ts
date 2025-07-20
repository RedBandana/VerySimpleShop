import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { resetOrderSuccessStates, startCheckoutSession, startGetOrder, startGetOrderByNumber } from '../store/order.actions';
import { OrderState } from '../store/order.reducer';
import { LogService } from '../../../core/services/log.service';
import { Router } from '@angular/router';
import { CartDispatchService } from '../../carts/services/cart-dispatch.service';

@Injectable({
  providedIn: 'root',
})
export class OrderDispatchService {
  private logService: LogService = new LogService(OrderDispatchService.name);
  state?: OrderState;

  get subscription() {
    return this.store.select((state) => state.order);
  }

  constructor(
    private store: Store<{ order: OrderState }>,
    private cartDispatchService: CartDispatchService,
    private router: Router,
  ) {
    this.subscribeNgRx();
  }

  private subscribeNgRx() {
    this.store
      .select((state) => state.order)
      .subscribe((orderState) => {
        if (!orderState) return;
        this.state = orderState;

        if (this.state.checkoutSessionSuccess) {
          if (this.state.order?.sessionUrl) {
            window.location.href = this.state.order.sessionUrl;
            this.cartDispatchService.getMyCart();
          } else {
            this.router.navigate(["/"]);
          }
        }

        this.resetOrderSuccessStates(orderState);
      });
  }

  private resetOrderSuccessStates(state: OrderState) {
    if (state.success) {
      this.logService.log('resetOrderSuccessStates');
      this.store.dispatch(resetOrderSuccessStates());
    }
  }

  private waitForLoadingToEnd(): Observable<boolean> {
    return this.store
      .select((state) => state.order.loading)
      .pipe(
        filter((loading) => !loading),
        take(1),
      );
  }

  createCheckoutSession() {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startCheckoutSession');
      this.store.dispatch(startCheckoutSession());
    });
  }

  getOrder(orderId: string) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startGetOrder');
      this.store.dispatch(startGetOrder({ orderId }));
    });
  }

  getOrderByNumber(orderNumber: string) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startGetOrderByNumber');
      this.store.dispatch(startGetOrderByNumber({ orderNumber }));
    });
  }
}
