import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as OrderActions from './order.actions';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrderService } from '../services/order.service';

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private orderService = inject(OrderService);

  createOrderSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.startCheckoutSession),
      switchMap((_) =>
        this.orderService.createCheckoutSession().pipe(
          map((order) => OrderActions.checkoutSessionSuccess({ order })),
          catchError((error) => of(OrderActions.checkoutSessionFailure({ error }))),
        ),
      ),
    ),
  );

  getOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.startGetOrder),
      switchMap(({ orderId }) =>
        this.orderService.getOrder(orderId).pipe(
          map((order) => OrderActions.getOrderSuccess({ order })),
          catchError((error) => of(OrderActions.getOrderFailure({ error }))),
        ),
      ),
    ),
  );

  getOrderByNumber$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.startGetOrderByNumber),
      switchMap(({ orderNumber }) =>
        this.orderService.getOrderByNumber(orderNumber).pipe(
          map((order) => OrderActions.getOrderByNumberSuccess({ order })),
          catchError((error) => of(OrderActions.getOrderByNumberFailure({ error }))),
        ),
      ),
    ),
  );
}
