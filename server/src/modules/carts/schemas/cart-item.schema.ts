import { Schema } from "mongoose";

export interface CartItem {
    productId: string;
    quantity: number;
}

export const CartItemSchema = new Schema<CartItem>({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
});