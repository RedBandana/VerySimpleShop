import { createAction, props } from '@ngrx/store';
import {
  IProduct,
  ICreateProductRequest,
  IUpdateProductRequest,
  IGetProductsRequest,
  IProductsResponse
} from '../../products';

export const loadProducts = createAction(
  '[Product] Load Products',
  props<{ request?: IGetProductsRequest }>()
);

export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ response: IProductsResponse }>()
);

export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);

export const loadProduct = createAction(
  '[Product] Load Product',
  props<{ productId: string }>()
);

export const loadProductSuccess = createAction(
  '[Product] Load Product Success',
  props<{ product: IProduct }>()
);

export const loadProductFailure = createAction(
  '[Product] Load Product Failure',
  props<{ error: string }>()
);

export const createProduct = createAction(
  '[Product] Create Product',
  props<{ request: ICreateProductRequest }>()
);

export const createProductSuccess = createAction(
  '[Product] Create Product Success',
  props<{ product: IProduct }>()
);

export const createProductFailure = createAction(
  '[Product] Create Product Failure',
  props<{ error: string }>()
);

export const updateProduct = createAction(
  '[Product] Update Product',
  props<{ productId: string; request: IUpdateProductRequest }>()
);

export const updateProductSuccess = createAction(
  '[Product] Update Product Success',
  props<{ product: IProduct }>()
);

export const updateProductFailure = createAction(
  '[Product] Update Product Failure',
  props<{ error: string }>()
);

export const deleteProduct = createAction(
  '[Product] Delete Product',
  props<{ productId: string }>()
);

export const deleteProductSuccess = createAction(
  '[Product] Delete Product Success',
  props<{ productId: string }>()
);

export const deleteProductFailure = createAction(
  '[Product] Delete Product Failure',
  props<{ error: string }>()
);

export const clearProductError = createAction(
  '[Product] Clear Product Error'
);

export const clearSelectedProduct = createAction(
  '[Product] Clear Selected Product'
);

export const setProductsFilter = createAction(
  '[Product] Set Products Filter',
  props<{ filter: IGetProductsRequest }>()
);

export const clearProductsFilter = createAction(
  '[Product] Clear Products Filter'
);