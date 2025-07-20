import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './order.actions';
import { IOrder } from '../models/order.model';

export interface OrderState {
  order?: IOrder;
  error?: string;
  loading: boolean;
  checkoutSessionSuccess: boolean;
  getSuccess: boolean;
  getByNumberSuccess: boolean;
  success: boolean;
}

export const initialState: OrderState = {
  order: undefined,
  error: undefined,
  loading: false,
  checkoutSessionSuccess: false,
  getSuccess: false,
  getByNumberSuccess: false,
  success: false
}

export const orderReducer = createReducer(
  initialState,

  on(OrderActions.resetOrderSuccessStates, (state) => ({
    ...state,
    success: false,
    checkoutSessionSuccess: false,
    getSuccess: false,
  })),

  on(OrderActions.resetOrderError, (state) => ({
    ...state,
    error: undefined,
  })),

  on(OrderActions.startCheckoutSession, (state) => ({
    ...state,
    checkoutSessionSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(OrderActions.checkoutSessionSuccess, (state, { order }) => ({
    ...state,
    order,
    loading: false,
    error: undefined,
    success: true,
    checkoutSessionSuccess: true,
  })),

  on(OrderActions.checkoutSessionFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    checkoutSessionSuccess: false,
  })),

  on(OrderActions.startGetOrder, (state) => ({
    ...state,
    getSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(OrderActions.getOrderSuccess, (state, { order }) => ({
    ...state,
    order,
    loading: false,
    error: undefined,
    success: true,
    getSuccess: true,
  })),

  on(OrderActions.getOrderFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    getSuccess: false,
  })),

  on(OrderActions.startGetOrderByNumber, (state) => ({
    ...state,
    getByNumberSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(OrderActions.getOrderByNumberSuccess, (state, { order }) => ({
    ...state,
    order,
    loading: false,
    error: undefined,
    success: true,
    getByNumberSuccess: true,
  })),

  on(OrderActions.getOrderByNumberFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    getByNumberSuccess: false,
  })),
);
