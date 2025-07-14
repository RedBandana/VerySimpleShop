import { createAction, props } from '@ngrx/store';
import {
  IProduct,
  IGetProductsRequest,
  IProductsPagination
} from '../../products';

export const resetProductSuccessStates = createAction('[Product] Reset Product Success State');

export const startGetAllProducts = createAction(
  '[Product] Start Get Products',
  props<{ request?: IGetProductsRequest }>()
);

export const getAllProductsSuccess = createAction(
  '[Product] Get All Products Success',
  props<{ response: IProductsPagination }>()
);

export const getAllProductsFailure = createAction(
  '[Product] Get All Products Failure',
  props<{ error: string }>()
);

export const startGetProduct = createAction(
  '[Product] Start Get Product',
  props<{ productId: string }>()
);

export const getProductSuccess = createAction(
  '[Product] Get Product Success',
  props<{ product: IProduct }>()
);

export const getProductFailure = createAction(
  '[Product] Get Product Failure',
  props<{ error: string }>()
);
