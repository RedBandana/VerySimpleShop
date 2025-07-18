import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ICart, ICartItem } from '../../models/cart.model';
import { CartState } from '../../store/cart.reducer';
import { Subscription } from 'rxjs';
import { CartDispatchService } from '../../services/cart-dispatch.service';
import { LocalizationService } from '../../../../core/services/localization.service';
import { OrderDispatchService } from '../../../orders/services/order-dispatch.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCart implements OnInit, OnDestroy {

  cartState?: CartState;
  cartSubscription!: Subscription;

  constructor(
    private cartDispatchService: CartDispatchService,
    private orderDispatchService: OrderDispatchService,
    private localizationService: LocalizationService,
  ) {
  }

  get cartItems(): ICartItem[] {
    return this.cartState?.cart?.items ?? [];
  }

  get totalPriceString() {
    return this.localizationService.formatCurrency(this.cartState?.cart?.totalPrice ?? 0);
  }

  ngOnInit(): void {
    this.subscribeNgRx();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.cartSubscription = this.cartDispatchService.subscription.subscribe((state) => {
      this.cartState = state;
    });
  }

  getItemPrice(cartItem: ICartItem) {
    let unitPrice = cartItem._product?.price ?? 0;
    if (cartItem.variantId && cartItem._product) {
      const variantIndex = cartItem._product.variants.findIndex(v => v._id === cartItem.variantId);
      if (variantIndex !== -1) {
        const variantPrice = cartItem._product.variants[variantIndex].price;
        if (variantPrice) unitPrice = variantPrice;
      }
    }

    const finalPrice = unitPrice * cartItem.quantity;
    return finalPrice;
  }

  getItemPriceString(cartItem: ICartItem) {
    const finalPrice = this.getItemPrice(cartItem);
    return this.localizationService.formatCurrency(finalPrice);
  }

  removeCartItem(cartItem: ICartItem): void {
    const request = {
      productId: cartItem.productId,
      variantId: cartItem.variantId,
      quantity: 0
    };
    this.cartDispatchService.updateCartItem(request);
  }

  addToCart(cartItem: ICartItem): void {
    const request = {
      productId: cartItem.productId,
      variantId: cartItem.variantId,
      quantity: 1
    };
    this.cartDispatchService.addToCart(request);
  }

  removeFromCart(cartItem: ICartItem): void {
    const request = {
      productId: cartItem.productId,
      variantId: cartItem.variantId,
      quantity: 1
    };
    this.cartDispatchService.removeFromCart(request);
  }

  checkout(): void {
    this.orderDispatchService.createCheckoutSession();
  }
}