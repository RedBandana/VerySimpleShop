export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  isGuestCart: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  _id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product?: any; // Will be populated with product details
  selectedOptions?: { [optionId: string]: string };
}

export interface IAddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedOptions?: { [optionId: string]: string };
}

export interface IUpdateCartRequest {
  cartItemId: string;
  quantity: number;
}

export interface IRemoveFromCartRequest {
  cartItemId: string;
}