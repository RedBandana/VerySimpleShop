import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CartFacadeService } from '../../../carts/services/cart-facade.service';
import { OrderService } from '../../services/order.service';
import { ICart } from '../../../carts/models/cart.model';
import { IAddress } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class Checkout implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  checkoutForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  
  cart$!: Observable<ICart | null>;
  
  constructor(
    private fb: FormBuilder,
    private cartFacade: CartFacadeService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.createCheckoutForm();
    this.cart$ = this.cartFacade.cart$;
  }
  
  ngOnInit(): void {
    this.cartFacade.loadCart();
    
    // Check if cart is empty and redirect if so
    this.cart$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(cart => {
      if (cart && cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private createCheckoutForm(): FormGroup {
    return this.fb.group({
      shippingAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', Validators.required]
      })
    });
  }
  
  onSubmit(): void {
    if (this.checkoutForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = null;
      
      // Create checkout session with Stripe
      this.orderService.createCheckoutSession().pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          if (response.success && response.data.url) {
            // Redirect to Stripe checkout
            window.location.href = response.data.url;
          } else {
            this.error = 'Failed to create checkout session';
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.error = error.message || 'Failed to create checkout session';
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  
  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'This field is required';
    }
    return '';
  }
}