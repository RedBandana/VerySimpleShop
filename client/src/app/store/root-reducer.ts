import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { productReducer } from '../features/products/store/product.reducer';

export const rootReducer: ActionReducerMap<AppState> = {
  products: productReducer,
};
