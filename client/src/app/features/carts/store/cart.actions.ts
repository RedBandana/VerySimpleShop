import { createAction, props } from '@ngrx/store';
import { ICart } from '../models/cart.model';
import { IAddToCartRequest, IRemoveFromCartRequest, IUpdateCartRequest } from '../models/cart-request.model';

export const resetCartSuccessStates = createAction('[Cart] Reset User Success State');

export const startGetMyCart = createAction('[Cart] Start Get My Cart');

export const getMyCartSuccess = createAction('[Cart] Get My Cart Success', props<{ cart: ICart }>());

export const getMyCartFailure = createAction('[Cart] Get My Cart Failure', props<{ error: string }>());

export const startAddToCart = createAction('[Cart] Start Add to Cart', props<{ request: IAddToCartRequest }>());

export const addToCartSuccess = createAction('[Cart] Add to Cart Success', props<{ cart: ICart }>());

export const addToCartFailure = createAction('[Cart] Add to Cart Failure', props<{ error: string }>());

export const startRemoveFromCart = createAction('[Cart] Start Remove to Cart', props<{ request: IRemoveFromCartRequest }>());

export const removeFromCartSuccess = createAction('[Cart] Remove from Cart Success', props<{ cart: ICart }>());

export const removeFromCartFailure = createAction('[Cart] Remove from Cart Failure', props<{ error: string }>());

export const startUpdateCartItem = createAction('[Cart] Start Update Cart Item', props<{ request: IUpdateCartRequest }>());

export const updateCartItemSuccess = createAction('[Cart] Update Cart Item Success', props<{ cart: ICart }>());

export const updateCartItemFailure = createAction('[Cart] Update Cart Item Failure', props<{ error: string }>());
