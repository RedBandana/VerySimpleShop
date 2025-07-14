import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { IProduct, IGetProductsRequest, IProductsPagination } from '../../products';

export interface ProductState {
  productsPagination?: IProductsPagination;
  product?: IProduct;
  loading: boolean;
  error?: string;
  filter?: IGetProductsRequest;
  success: boolean;
  getAllSuccess: boolean;
  getSuccess: boolean;
}

export const initialState: ProductState = {
  productsPagination: undefined,
  product: undefined,
  loading: false,
  error: undefined,
  filter: undefined,
  success: false,
  getAllSuccess: false,
  getSuccess: false
};

export const productReducer = createReducer(
  initialState,

  on(ProductActions.resetProductSuccessStates, (state) => ({
    ...state,
    success: false,
    getAllSuccess: false,
    getSuccess: false,
  })),

  on(ProductActions.startGetAllProducts, (state) => ({
    ...state,
    getAllSuccess: false,
    loading: true,
    error: undefined,
  })),

  on(ProductActions.getAllProductsSuccess, (state, { response }) => ({
    ...state,
    productsPagination: response,
    loading: false,
    error: undefined,
    success: true,
    getAllSuccess: true,
  })),

  on(ProductActions.getAllProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    getAllSuccess: false,
  })),

  on(ProductActions.startGetProduct, (state) => ({
    ...state,
    loading: true,
    error: undefined,
    getSuccess: false,
  })),

  on(ProductActions.getProductSuccess, (state, { product }) => ({
    ...state,
    product: product,
    loading: false,
    error: undefined,
    success: true,
    getSuccess: true,
  })),

  on(ProductActions.getProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    getSuccess: false,
  })),
);