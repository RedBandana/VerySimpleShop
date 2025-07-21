import { createAction, props } from '@ngrx/store';
import { IOrder } from '../models/order.model';
import { IGetOrderByAuthRequest } from '../models/order-request.model';

export const resetOrderSuccessStates = createAction('[Order] Reset Order Success State');

export const resetOrderError = createAction('[Order] Reset Order Error');

export const startCheckoutSession = createAction('[Order] Start Checkout Sesion');

export const checkoutSessionSuccess = createAction('[Order] Checkout Session Success', props<{ order: IOrder }>());

export const checkoutSessionFailure = createAction('[Order] Checkout Session Failure', props<{ error: string }>());

export const startGetOrder = createAction('[Order] Start Get Order', props<{ orderId: string }>());

export const getOrderSuccess = createAction('[Order] Get Order Success', props<{ order: IOrder }>());

export const getOrderFailure = createAction('[Order] Get Order Failure', props<{ error: string }>());

export const startGetOrderByNumber = createAction('[Order] Start Get Order By Number', props<{ orderNumber: string }>());

export const getOrderByNumberSuccess = createAction('[Order] Get Order By Number Success', props<{ order: IOrder }>());

export const getOrderByNumberFailure = createAction('[Order] Get Order By Number Failure', props<{ error: string }>());

export const startGetOrderByAuth = createAction('[Order] Start Get Order By Auth', props<{ request: IGetOrderByAuthRequest }>());

export const getOrderByAuthSuccess = createAction('[Order] Get Order By Auth Success', props<{ order: IOrder }>());

export const getOrderByAuthFailure = createAction('[Order] Get Order By Auth Failure', props<{ error: string }>());
