import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../models/product.model';
import { ProductItem } from '../../components/product-item/product-item';
import { ButtonToggle } from '../../../../shared/components/inputs/button-toggle/button-toggle';
import { ProductFacadeService } from '../../services/product-facade.service';

@Component({
  selector: 'app-featured-products',
  imports: [CommonModule, ButtonToggle, ProductItem],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProducts implements OnInit {
  trending: string[] = ["New In", "Popular", "Sale"];
  selectedTrendingIndex = 0;
  
  // Simple observables from facade
  products$;
  loading$;
  error$;

  constructor(private productFacade: ProductFacadeService) {
    this.products$ = this.productFacade.products$;
    this.loading$ = this.productFacade.loading$;
    this.error$ = this.productFacade.error$;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  onTrendingSelect(index: number): void {
    this.selectedTrendingIndex = index;
    // TODO: Implement filtering logic based on trending selection
    this.loadProducts();
  }

  onRetryLoad(): void {
    this.loadProducts();
  }

  trackByProduct(index: number, product: IProduct): string {
    return product._id || index.toString();
  }

  private loadProducts(): void {
    this.productFacade.loadProducts();
  }
}
