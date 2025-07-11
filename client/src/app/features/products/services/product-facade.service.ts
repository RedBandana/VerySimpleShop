import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { IProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductFacadeService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private productsSubject = new BehaviorSubject<IProduct[]>([]);
  private selectedProductSubject = new BehaviorSubject<IProduct | null>(null);

  // Public observables
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  products$ = this.productsSubject.asObservable();
  selectedProduct$ = this.selectedProductSubject.asObservable();

  constructor(private productService: ProductService) {}

  loadProducts(params?: any): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.productService.getProducts(params).pipe(
      tap(response => {
        this.productsSubject.next(response.products);
      }),
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to load products');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  loadProduct(productId: string): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.productService.getProduct(productId).pipe(
      tap(product => {
        this.selectedProductSubject.next(product);
      }),
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to load product');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  clearSelectedProduct(): void {
    this.selectedProductSubject.next(null);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // Utility methods
  getProductById(productId: string): IProduct | null {
    return this.productsSubject.value.find(p => p._id === productId) || null;
  }

  getProducts(): IProduct[] {
    return this.productsSubject.value;
  }
}