import { Component, Input } from '@angular/core';
import { LocalizationService } from '../../../../core/services/localization.service';
import { ICartItem } from '../../models/cart.model';
import { IProductVariant } from '../../../products';
import { RouterModule } from '@angular/router';
import { CartState } from '../../store/cart.reducer';
import { Subscription } from 'rxjs';
import { OrderState } from '../../../orders/store/order.reducer';
import { CartDispatchService } from '../../services/cart-dispatch.service';
import { OrderDispatchService } from '../../../orders/services/order-dispatch.service';
import { CartUtils } from '../../services/cart.utils';

@Component({
  selector: 'app-cart-item-list',
  imports: [RouterModule],
  templateUrl: './cart-item-list.component.html',
  styleUrl: './cart-item-list.component.scss'
})
export class CartItemListComponent {
  @Input() isOrder: boolean = false;

  cartState?: CartState;
  cartSubscription!: Subscription;

  orderState?: OrderState;
  orderSubscription!: Subscription;

  constructor(
    private cartDispatchService: CartDispatchService,
    private orderDispatchService: OrderDispatchService,
    private localizationService: LocalizationService,
  ) {
  }

  ngOnInit(): void {
    this.subscribeNgRx();
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
    });
  }

  onRemoveCartItem(cartItem: ICartItem): void {
    const request = {
      productId: cartItem.productId,
      variantId: cartItem.variantId,
      quantity: 0
    };
    this.cartDispatchService.updateCartItem(request);
  }

  onAddToCart(cartItem: ICartItem): void {
    const request = {
      productId: cartItem.productId,
      variantId: cartItem.variantId,
      quantity: 1
    };
    this.cartDispatchService.addToCart(request);
  }

  onRemoveFromCart(cartItem: ICartItem): void {
    const request = {
      productId: cartItem.productId,
      variantId: cartItem.variantId,
      quantity: 1
    };
    this.cartDispatchService.removeFromCart(request);
  }

  onProceedToCheckout(): void {
    this.orderDispatchService.createCheckoutSession();
  }

  get cartItems(): ICartItem[] {
    return this.isOrder ?
      this.orderState?.order?._cart?.items ?? [] :
      this.cartState?.cart?.items ?? [];
  }

  get totalPriceString() {
    return this.isOrder ?
      this.localizationService.formatCurrency(this.orderState?.order?._cart?.totalPrice ?? 0) :
      this.localizationService.formatCurrency(this.cartState?.cart?.totalPrice ?? 0);
  }

  getVariant(cartItem: ICartItem): IProductVariant | undefined {
    return CartUtils.getVariant(cartItem);
  }

  getFullName(cartItem: ICartItem): string {
    return CartUtils.getFullName(cartItem);
  }

  getItemImageUrl(cartItem: ICartItem): string {
    return CartUtils.getItemImageUrl(cartItem);
  }

  getItemPrice(cartItem: ICartItem) {
    return CartUtils.getItemPrice(cartItem);
  }

  getItemFullPrice(cartItem: ICartItem) {
    return CartUtils.getItemFullPrice(cartItem);
  }

  getItemPriceString(cartItem: ICartItem) {
    const finalPrice = this.getItemPrice(cartItem);
    return this.localizationService.formatCurrency(finalPrice);
  }

  getItemFullPriceString(cartItem: ICartItem) {
    const finalPrice = this.getItemFullPrice(cartItem);
    return this.localizationService.formatCurrency(finalPrice);
  }
}
