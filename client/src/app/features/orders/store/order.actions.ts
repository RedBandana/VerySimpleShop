import { createAction, props } from '@ngrx/store';
import { IOrder } from '../models/order.model';

export const resetOrderSuccessStates = createAction('[Order] Reset User Success State');

export const startCheckoutSession = createAction('[Order] Start Checkout Sesion');

export const checkoutSessionSuccess = createAction('[Order] Checkout Session Success', props<{ order: IOrder }>());

export const checkoutSessionFailure = createAction('[Order] Checkout Session Failure', props<{ error: string }>());

export const startGetOrder = createAction('[Order] Start Get Order', props<{ orderId: string }>());

export const getOrderSuccess = createAction('[Order] Get Order Success', props<{ order: IOrder }>());

export const getOrderFailure = createAction('[Order] Get Order Failure', props<{ error: string }>());
