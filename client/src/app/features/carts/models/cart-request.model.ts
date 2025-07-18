export interface IUpdateCartRequest {
    productId: string;
    variantId?: string;
    quantity: number;
}

export interface IAddToCartRequest extends IUpdateCartRequest { }

export interface IRemoveFromCartRequest extends IUpdateCartRequest { }
