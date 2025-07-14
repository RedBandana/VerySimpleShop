import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as ProductActions from './product.actions';
import { ProductService } from '../services/product.service';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  getAllProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.startGetAllProducts),
      switchMap(({ request }) =>
        this.productService.getAllProducts(request).pipe(
          map(response => ProductActions.getAllProductsSuccess({
            response: {
              products: response.data,
              ...response.pagination
            }
          })),
          catchError(error => of(ProductActions.getAllProductsFailure({ error: error.message })))
        )
      )
    )
  );

  getProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.startGetProduct),
      switchMap(({ productId }) =>
        this.productService.getProduct(productId).pipe(
          map(product => ProductActions.getProductSuccess({ product })),
          catchError(error => of(ProductActions.getProductFailure({ error: error.message })))
        )
      )
    )
  );
}