import mongoose, { Schema } from "mongoose";
import { CartItemSchema, CartItem } from "./cart-item.schema";
import { DatabaseModel } from "src/common/enums/database-model.enum";

export interface Cart extends Document {
    customerId: string;
    orderId?: string;
    items: CartItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

export const CartSchema = new Schema<Cart>(
    {
        customerId: { type: String, required: true },
        items: { type: [CartItemSchema], required: true },
        totalPrice: { type: Number, required: true, default: 0 },
        orderId: { type: String, required: false },
    },
    {
        timestamps: true,
    },
);

CartSchema.index(
    { orderId: 1 },
    {
        unique: true,
        sparse: true,
        partialFilterExpression: {
            orderId: {
                $and: [
                    { $exists: true },
                    { $ne: null },
                    { $ne: '' }
                ]
            }
        }
    }
);

export const CartModel = mongoose.model<Cart>(DatabaseModel.CART, CartSchema);
