import { AuthState } from '../features/auth/store/auth.reducer';
import { ProductState } from '../features/products/store/product.reducer';
import { UserState } from '../features/users/store/user.reducer';

export interface AppState {
  product: ProductState;
  auth: AuthState;
  user: UserState;
}