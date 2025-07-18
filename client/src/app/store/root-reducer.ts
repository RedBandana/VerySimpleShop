import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { productReducer } from '../features/products/store/product.reducer';
import { authReducer } from '../features/auth/store/auth.reducer';
import { userReducer } from '../features/users/store/user.reducer';
import { cartReducer } from '../features/carts/store/cart.reducer';
import { orderReducer } from '../features/orders/store/order.reducer';

export const rootReducer: ActionReducerMap<AppState> = {
  product: productReducer,
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  order: orderReducer,
};
