import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IProduct } from '../../models/product.model';
import { ProductItem } from '../../components/product-item/product-item';
import { ButtonToggle } from '../../../../shared/components/inputs/button-toggle/button-toggle';
import { ProductDispatchService } from '../../services/product-dispatch.service';
import { ProductState } from '../..';

@Component({
  selector: 'app-featured-products',
  imports: [CommonModule, RouterModule, ButtonToggle, ProductItem],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProducts implements OnInit, OnDestroy {
  trending: string[] = ["New In", "Popular", "Sale"];
  selectedTrendingIndex = 0;

  productState?: ProductState;
  productSubscription!: Subscription;

  constructor(private productDispatchService: ProductDispatchService) { }

  get products(): IProduct[] {
    return this.productState?.productsPagination?.products ?? [];
  }

  ngOnInit(): void {
    this.subscribeNgRx();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.productSubscription = this.productDispatchService.subscription.subscribe((state) => {
      this.productState = state;
    });
  }

  private loadProducts(): void {
    this.productDispatchService.getAllProducts();
  }
}
