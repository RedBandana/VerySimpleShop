import { AuthState } from '../features/auth/store/auth.reducer';
import { CartState } from '../features/carts/store/cart.reducer';
import { OrderState } from '../features/orders/store/order.reducer';
import { ProductState } from '../features/products/store/product.reducer';
import { UserState } from '../features/users/store/user.reducer';

export interface AppState {
  product: ProductState;
  auth: AuthState;
  user: UserState;
  cart: CartState;
  order: OrderState;
}