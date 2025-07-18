import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CartActions from './cart.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService } from '../services/cart.service';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);

  getMyCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.startGetMyCart),
      mergeMap((_) =>
        this.cartService.getMyCart().pipe(
          map((cart) => CartActions.getMyCartSuccess({ cart })),
          catchError((error) => of(CartActions.getMyCartFailure({ error }))),
        ),
      ),
    ),
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.startAddToCart),
      mergeMap(({ request }) =>
        this.cartService.addToCart(request).pipe(
          map((cart) => CartActions.addToCartSuccess({ cart })),
          catchError((error) => of(CartActions.addToCartFailure({ error }))),
        ),
      ),
    ),
  );

  removeFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.startRemoveFromCart),
      mergeMap(({ request }) =>
        this.cartService.removeFromCart(request).pipe(
          map((cart) => CartActions.removeFromCartSuccess({ cart })),
          catchError((error) => of(CartActions.removeFromCartFailure({ error }))),
        ),
      ),
    ),
  );

  updateCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.startUpdateCartItem),
      mergeMap(({ request }) =>
        this.cartService.updateCartItem(request).pipe(
          map((cart) => CartActions.updateCartItemSuccess({ cart })),
          catchError((error) => of(CartActions.updateCartItemFailure({ error }))),
        ),
      ),
    ),
  );
}
