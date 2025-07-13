export interface IOrder {
  _id: string;
  userId: string;
  cartId: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  totalPrice: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  _id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product?: any;
  selectedOptions?: { [optionId: string]: string };
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

export interface ICreateOrderRequest {
  shippingAddress: IAddress;
}

export interface ICheckoutSessionResponse {
  url: string;
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