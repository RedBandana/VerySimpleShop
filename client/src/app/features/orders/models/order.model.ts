import { ICart } from "../../carts/models/cart.model";
import { IUser } from "../../users/models/user.model";

export interface IOrder {
  _id: string;
  createdAt: string;
  updatedAt: string;

  userId: string;
  cartId: string;
  shippingAddress: IAddress;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  sessionId: string;
  sessionUrl: string;

  _cart: ICart;
  _user: IUser;
}

export interface IOrderItem {
  _id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
 
  _product?: any;
}

export interface IAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}
