import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ProductService } from '../services/product.service';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductEffects {

  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(({ request }) =>
        this.productService.getProducts(request).pipe(
          map(response => ProductActions.loadProductsSuccess({ response })),
          catchError(error => of(ProductActions.loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap(({ productId }) =>
        this.productService.getProduct(productId).pipe(
          map(product => ProductActions.loadProductSuccess({ product })),
          catchError(error => of(ProductActions.loadProductFailure({ error: error.message })))
        )
      )
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      switchMap(({ request }) =>
        this.productService.createProduct(request).pipe(
          map(product => ProductActions.createProductSuccess({ product })),
          catchError(error => of(ProductActions.createProductFailure({ error: error.message })))
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      switchMap(({ productId, request }) =>
        this.productService.updateProduct(productId, request).pipe(
          map(product => ProductActions.updateProductSuccess({ product })),
          catchError(error => of(ProductActions.updateProductFailure({ error: error.message })))
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap(({ productId }) =>
        this.productService.deleteProduct(productId).pipe(
          map(() => ProductActions.deleteProductSuccess({ productId })),
          catchError(error => of(ProductActions.deleteProductFailure({ error: error.message })))
        )
      )
    )
  );
}