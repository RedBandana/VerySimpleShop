import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { LogService } from '../../../core/services/log.service';
import { CartState } from '../store/cart.reducer';
import { ICart } from '../models/cart.model';
import { resetCartSuccessStates, startAddToCart, startGetMyCart, startRemoveFromCart, startUpdateCartItem } from '../store/cart.actions';
import { IAddToCartRequest } from '../models/cart-request.model';

@Injectable({
  providedIn: 'root',
})
export class CartDispatchService {
  private logService: LogService = new LogService(CartDispatchService.name);
  state?: CartState;

  get subscription() {
    return this.store.select((state) => state.cart);
  }

  constructor(private store: Store<{ cart: CartState }>) {
    this.subscribeNgRx();
  }

  private subscribeNgRx() {
    this.store
      .select((state) => state.cart)
      .subscribe((cartState) => {
        if (!cartState) return;
        this.state = cartState;

        this.resetCartSuccessStates();
      });
  }

  private resetCartSuccessStates() {
    if (this.state?.success) {
      this.logService.log('resetCartSuccessStates');
      this.store.dispatch(resetCartSuccessStates());
    }
  }

  private waitForLoadingToEnd(): Observable<boolean> {
    return this.store
      .select((state) => state.cart.loading)
      .pipe(
        filter((loading) => !loading),
        take(1),
      );
  }

  getMyCart() {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startGetMyCart');
      this.store.dispatch(startGetMyCart());
    });
  }

  addToCart(request: IAddToCartRequest) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startAddToCart');
      this.store.dispatch(startAddToCart({ request }));
    });
  }

  removeFromCart(request: IAddToCartRequest) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startRemoveFromCart');
      this.store.dispatch(startRemoveFromCart({ request }));
    });
  }

  updateCartItem(request: IAddToCartRequest) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startUpdateCartItem');
      this.store.dispatch(startUpdateCartItem({ request }));
    });
  }
}
