import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { IProduct, IGetProductsRequest } from '../../products';

export interface ProductState {
  products: IProduct[];
  selectedProduct: IProduct | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filter: IGetProductsRequest | null;
}

export const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  filter: null
};

export const productReducer = createReducer(
  initialState,

  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.loadProductsSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    products: response.products,
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
    error: null
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ProductActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    selectedProduct: product,
    error: null
  })),

  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ProductActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: [...state.products, product],
    total: state.total + 1,
    error: null
  })),

  on(ProductActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    loading: false,
    products: state.products.map(p => (p._id && product._id && p._id === product._id) ? product : p),
    selectedProduct: (state.selectedProduct?._id && product._id && state.selectedProduct._id === product._id) ? product : state.selectedProduct,
    error: null
  })),

  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.deleteProductSuccess, (state, { productId }) => ({
    ...state,
    loading: false,
    products: state.products.filter(p => p._id !== productId),
    selectedProduct: state.selectedProduct?._id === productId ? null : state.selectedProduct,
    total: state.total - 1,
    error: null
  })),

  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ProductActions.clearProductError, (state) => ({
    ...state,
    error: null
  })),

  on(ProductActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProduct: null
  })),

  on(ProductActions.setProductsFilter, (state, { filter }) => ({
    ...state,
    filter
  })),

  on(ProductActions.clearProductsFilter, (state) => ({
    ...state,
    filter: null
  }))
);