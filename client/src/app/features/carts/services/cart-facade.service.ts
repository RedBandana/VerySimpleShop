import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { CartService } from './cart.service';
import { ICart, IAddToCartRequest, IUpdateCartRequest, IRemoveFromCartRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartFacadeService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private cartSubject = new BehaviorSubject<ICart | null>(null);

  // Public observables
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  cart$ = this.cartSubject.asObservable();

  get currentCart(): ICart | null {
    return this.cartSubject.value;
  }

  get itemCount(): number {
    return this.currentCart?.totalItems || 0;
  }

  get totalPrice(): number {
    return this.currentCart?.totalPrice || 0;
  }

  constructor(private cartService: CartService) {}

  loadCart(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.cartService.getMyCart().pipe(
      tap(response => {
        this.cartSubject.next(response.data);
      }),
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to load cart');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  addToCart(request: IAddToCartRequest): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.cartService.addToCart(request).pipe(
      tap(response => {
        this.cartSubject.next(response.data);
      }),
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to add item to cart');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  updateCartItem(request: IUpdateCartRequest): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.cartService.updateCartItem(request).pipe(
      tap(response => {
        this.cartSubject.next(response.data);
      }),
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to update cart item');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  removeFromCart(request: IRemoveFromCartRequest): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.cartService.removeFromCart(request).pipe(
      tap(response => {
        this.cartSubject.next(response.data);
      }),
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to remove item from cart');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  clearCart(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.cartService.clearCart().pipe(
      tap(response => {
        this.cartSubject.next(response.data);
      }),
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to clear cart');
        return of(null);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}