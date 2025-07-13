import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ICart, ICartItem } from '../../models/cart.model';
import { CartFacadeService } from '../../services/cart-facade.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCart implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cart$!: Observable<ICart | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(private cartFacade: CartFacadeService) {
    this.cart$ = this.cartFacade.cart$;
    this.loading$ = this.cartFacade.loading$;
    this.error$ = this.cartFacade.error$;
  }

  ngOnInit(): void {
    this.cartFacade.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUpdateQuantity(cartItem: ICartItem, quantity: number): void {
    if (quantity <= 0) {
      this.onRemoveItem(cartItem);
      return;
    }

    this.cartFacade.updateCartItem({
      cartItemId: cartItem._id,
      quantity
    });
  }

  onRemoveItem(cartItem: ICartItem): void {
    this.cartFacade.removeFromCart({
      cartItemId: cartItem._id
    });
  }

  onClearCart(): void {
    this.cartFacade.clearCart();
  }

  onRetryLoad(): void {
    this.cartFacade.loadCart();
  }

  trackByCartItem(index: number, item: ICartItem): string {
    return item._id;
  }
}