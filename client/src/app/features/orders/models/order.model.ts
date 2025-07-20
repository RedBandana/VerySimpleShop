import { IAddress } from "../../../core/interfaces/address.interface";
import { ICart } from "../../carts/models/cart.model";
import { IUser } from "../../users/models/user.model";

export interface IOrder {
  _id: string;
  createdAt: string;
  updatedAt: string;

  userId: string;
  cartId: string;
  number: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingDetails: IShippingDetails;
  sessionId: string;
  sessionUrl: string;

  _cart: ICart;
  _user: IUser;
}

export interface IShippingDetails {
  name: string;
  email: string;
  address: IAddress;
  carrier?: string;
  phone?: string;
  trackingNumber?: string;
}

export interface IOrderItem {
  _id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;

  _product?: any;
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
