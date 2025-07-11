import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

import { IProduct, IProductVariant } from '../../models/product.model';
import { ProductFacadeService } from '../../services/product-facade.service';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetail implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Component state
  selectedVariant: IProductVariant | null = null;
  selectedOptions: { [optionId: string]: string } = {};
  selectedImageIndex = 0;
  quantity = 1;
  
  // Simple observables from facade
  product$;
  loading$;
  error$;
  
  // Computed getters
  get currentProduct(): IProduct | null {
    let product: IProduct | null = null;
    this.product$.pipe(takeUntil(this.destroy$)).subscribe(p => product = p);
    return product;
  }
  
  get collections(): string {
    return this.currentProduct?.collections?.join(', ') || '';
  }
  
  get currentPrice(): number {
    return this.selectedVariant?.price || this.currentProduct?.price || 0;
  }
  
  get currentImageUrls(): string[] {
    if (this.selectedVariant?.imageUrls?.length) {
      return this.selectedVariant.imageUrls;
    }
    return this.currentProduct?.imageUrls || [];
  }

  constructor(
    private productFacade: ProductFacadeService,
    private route: ActivatedRoute
  ) {
    this.product$ = this.productFacade.selectedProduct$;
    this.loading$ = this.productFacade.loading$;
    this.error$ = this.productFacade.error$;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map(params => params.get('id'))
    ).subscribe(productId => {
      if (productId) {
        this.loadProduct(productId);
      }
    });

    // Initialize selected options when product loads
    this.product$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(product => {
      if (product) {
        this.initializeSelectedOptions(product);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.productFacade.clearSelectedProduct();
  }

  onOptionSelect(optionId: string, choiceId: string): void {
    this.selectedOptions = {
      ...this.selectedOptions,
      [optionId]: choiceId
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
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', {
      product: this.selectedVariant || this.currentProduct,
      quantity: this.quantity,
      selectedOptions: this.selectedOptions
    });
  }

  onPrevious(): void {
    // TODO: Implement navigation to previous product
    console.log('Navigate to previous product');
  }

  onNext(): void {
    // TODO: Implement navigation to next product
    console.log('Navigate to next product');
  }

  onRetryLoad(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  isOptionSelected(optionId: string, choiceId: string): boolean {
    return this.selectedOptions[optionId] === choiceId;
  }

  trackByChoice(index: number, choice: any): string {
    return choice._id || index.toString();
  }

  trackByImage(index: number, imageUrl: string): string {
    return imageUrl;
  }

  private loadProduct(productId: string): void {
    this.productFacade.loadProduct(productId);
  }

  private initializeSelectedOptions(product: IProduct): void {
    const initialOptions: { [optionId: string]: string } = {};
    
    product.options?.forEach(option => {
      if (option.choices && option.choices.length > 0) {
        initialOptions[option._id || ''] = option.choices[0]._id || '';
      }
    });
    
    this.selectedOptions = initialOptions;
    this.updateSelectedVariant();
  }

  private updateSelectedVariant(): void {
    const product = this.currentProduct;
    if (!product?.variants) return;
    
    this.selectedVariant = product.variants.find(variant => {
      return Object.keys(this.selectedOptions).every(optionId => {
        const selectedChoice = this.selectedOptions[optionId];
        return variant.specifications?.[optionId] === selectedChoice;
      });
    }) || null;
    
    // Reset image selection when variant changes
    this.selectedImageIndex = 0;
  }
}