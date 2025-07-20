import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

import { IProduct, IProductVariant } from '../../models/product.model';
import { ProductDispatchService } from '../../services/product-dispatch.service';
import { ProductState } from '../..';
import { AuthDispatchService } from '../../../auth/services/auth-dispatch.service';
import { AuthState } from '../../../auth/store/auth.reducer';
import { UserDispatchService } from '../../../users/services/user-dispatch.service';
import { LocalizationService } from '../../../../core/services/localization.service';
import { CartItemAddedComponent } from "../../../carts/components/cart-item-added/cart-item-added.component";
import { CartDispatchService } from '../../../carts/services/cart-dispatch.service';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule, MarkdownModule, CartItemAddedComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetail implements OnInit, OnDestroy {

  selectedVariant: IProductVariant | null = null;
  selectedOptions: { [optionId: string]: string } = {};
  selectedImageIndex = 0;
  quantity = 1;

  waitingForAuthBeforeBuying = false;

  productState?: ProductState;
  productSubscription!: Subscription;
  authState?: AuthState;
  authSubscription!: Subscription;

  constructor(
    private productDispatchService: ProductDispatchService,
    private userDispatchService: UserDispatchService,
    private authDispatchService: AuthDispatchService,
    private cartDispatchService: CartDispatchService,
    private localizationService: LocalizationService,
    private route: ActivatedRoute,
  ) { }

  get product(): IProduct | undefined {
    return this.productState?.product;
  }

  get collections(): string {
    return this.product?.collections?.join(', ') || '';
  }

  get currentPrice(): number {
    return this.selectedVariant?.price || this.product?.price || 0;
  }

  get currentPriceString() {
    return this.localizationService.formatCurrency(this.currentPrice);
  }

  get currentImageUrls(): string[] {
    if (this.selectedVariant?.imageUrls?.length) {
      return this.selectedVariant.imageUrls;
    }
    return this.product?.imageUrls || [];
  }

  ngOnInit(): void {
    this.subscribeNgRx();

    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ).subscribe(productId => {
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.productSubscription = this.productDispatchService.subscription.subscribe((state) => {
      this.productState = state;

      if (state.getSuccess && state.product)
        this.initializeSelectedOptions(state.product);
    });

    this.authSubscription = this.authDispatchService.subscription.subscribe((state) => {
      this.authState = state;

      if (this.waitingForAuthBeforeBuying && state.guestSessionSuccess)
        this.onAddToCart();
    });
  }

  onOptionSelect(nameKey: string, valueKey: string): void {
    this.selectedOptions = {
      ...this.selectedOptions,
      [nameKey]: valueKey
    };

    this.updateSelectedVariant();
  }

  onImageSelect(index: number): void {
    this.selectedImageIndex = index;
  }

  onQuantityChange(quantity: number): void {
    this.quantity = Math.max(1, quantity);
  }

  onAddToCart(): void {
    const product = this.product;
    if (!product || !product._id) return;

    if (this.userDispatchService.hasAnActiveSession) {
      const addToCartRequest = {
        productId: product._id!,
        variantId: this.selectedVariant?._id,
        quantity: this.quantity,
      };

      this.cartDispatchService.addToCart(addToCartRequest);
    }
    else {
      this.waitingForAuthBeforeBuying = true;
      this.authDispatchService.createGuestSession();
    }
  }

  isOptionSelected(optionId: string, choiceId: string): boolean {
    if (!optionId && !choiceId) return false;
    return this.selectedOptions[optionId] === choiceId;
  }

  trackByChoice(index: number, choice: any): string {
    return choice._id || index.toString();
  }

  trackByImage(index: number, imageUrl: string): string {
    return imageUrl || index.toString();
  }

  private loadProduct(productId: string): void {
    this.productDispatchService.getProduct(productId);
  }

  private initializeSelectedOptions(product: IProduct): void {
    const initialOptions: { [optionId: string]: string } = {};

    product.options.forEach(option => {
      if (option.choices && option.choices.length > 0)
        initialOptions[option.nameKey] = option.choices[0].valueKey;
    });

    this.selectedOptions = initialOptions;
    this.updateSelectedVariant();
  }

  private updateSelectedVariant(): void {
    const product = this.product;
    if (!product?.variants) return;

    this.selectedVariant = product.variants.find(variant => {
      return Object.keys(this.selectedOptions).every(option => {
        const selectedChoice = this.selectedOptions[option];
        return variant.specifications?.[option] === selectedChoice;
      });
    }) || null;

    this.selectedImageIndex = 0;
  }
}