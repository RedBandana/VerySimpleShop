import { Type } from '@angular/core';
import { ProductEffects } from '../features/products';
import { FunctionalEffect } from '@ngrx/effects';
import { AuthEffects } from '../features/auth/store/auth.effects';
import { UserEffects } from '../features/users/store/user.effects';
import { CartEffects } from '../features/carts/store/cart.effects';
import { OrderEffects } from '../features/orders/store/order.effects';

export const rootEffect: Array<Type<unknown> | Record<string, FunctionalEffect>> = [
  ProductEffects,
  AuthEffects,
  UserEffects,
  CartEffects,
  OrderEffects,
];
