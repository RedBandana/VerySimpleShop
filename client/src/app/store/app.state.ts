import { ProductState } from '../features/products/store/product.reducer';

export interface AppState {
  products: ProductState;
}