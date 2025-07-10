import { Type } from '@angular/core';
import { ProductEffects } from '../features/products';
import { FunctionalEffect } from '@ngrx/effects';

export const rootEffect: Array<Type<unknown> | Record<string, FunctionalEffect>> = [
  ProductEffects
];
