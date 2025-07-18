import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { ICart } from '../models/cart.model';

export interface CartState {
  cart?: ICart;
  error?: string;
  loading: boolean;
  getMyCartSuccess: boolean;
  addToCartSuccess: boolean;
  removeFromCartSuccess: boolean;
  updateCartItemSuccess: boolean;
  success: boolean;
}

export const initialState: CartState = {
  cart: undefined,
  error: undefined,
  loading: false,
  getMyCartSuccess: false,
  addToCartSuccess: false,
  removeFromCartSuccess: false,
  updateCartItemSuccess: false,
  success: false
}

export const cartReducer = createReducer(
  initialState,

  on(CartActions.resetCartSuccessStates, (state) => ({
    ...state,
    success: false,
    getMyCartSuccess: false,
    addToCartSuccess: false,
    removeFromCartSuccess: false,
    updateCartItemSuccess: false,
  })),

  on(CartActions.startGetMyCart, (state) => ({
    ...state,
    getMyCartSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(CartActions.getMyCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: undefined,
    success: true,
    getMyCartSuccess: true,
  })),

  on(CartActions.getMyCartFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    getMyCartSuccess: false,
  })),

  
  on(CartActions.startAddToCart, (state) => ({
    ...state,
    addToCartSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(CartActions.addToCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: undefined,
    success: true,
    addToCartSuccess: true,
  })),

  on(CartActions.addToCartFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    addToCartSuccess: false,
  })),

  
  on(CartActions.startRemoveFromCart, (state) => ({
    ...state,
    removeFromCartSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(CartActions.removeFromCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: undefined,
    success: true,
    removeFromCartSuccess: true,
  })),

  on(CartActions.removeFromCartFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    removeFromCartSuccess: false,
  })),

  on(CartActions.startUpdateCartItem, (state) => ({
    ...state,
    updateCartItemSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(CartActions.updateCartItemSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: undefined,
    success: true,
    updateCartItemSuccess: true,
  })),

  on(CartActions.updateCartItemFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
    updateCartItemSuccess: false,
  })),
);
