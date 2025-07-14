import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IProduct } from '../../models/product.model';
import { ProductItem } from '../../components/product-item/product-item';
import { ProductDispatchService } from '../../services/product-dispatch.service';
import { ProductState } from '../../store';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterModule, ProductItem],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductList implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Filters
  searchTerm = '';
  sortBy = 'name';
  sortOrder = 'asc';
  priceRange = { min: 0, max: 1000 };
  selectedCategory = '';

  // Sort options
  sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'createdAt', label: 'Date Added' }
  ];

  productState?: ProductState;
  productSubscription!: Subscription;

  // Categories - in a real app, this would come from the API
  categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' }
  ];

  get products(): IProduct[] {
    return this.productState?.productsPagination?.products ?? [];
  }

  constructor(
    private productDispatchService: ProductDispatchService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.subscribeNgRx();

    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  subscribeNgRx() {
    this.productSubscription = this.productDispatchService.subscription.subscribe((state) => {
      this.productState = state;
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  onSortChange(): void {
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  onPriceRangeChange(): void {
    this.loadProducts();
  }

  onClearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.priceRange = { min: 0, max: 1000 };
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.loadProducts();
  }

  trackByProduct(index: number, product: IProduct): string {
    return product._id || index.toString();
  }

  private loadProducts(): void {
    const filters = {
      search: this.searchTerm,
      category: this.selectedCategory,
      minPrice: this.priceRange.min,
      maxPrice: this.priceRange.max,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      limit: 20
    };

    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    );

    this.productDispatchService.getAllProducts(cleanFilters);
  }
}