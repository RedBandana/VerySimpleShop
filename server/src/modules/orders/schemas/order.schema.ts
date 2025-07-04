import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus } from "src/common/enums/order-status.enum";
import { DatabaseModel } from "src/common/enums/database-model.enum";

export interface Order extends Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;

    customerId: string;
    cartId: string;
    status: OrderStatus;
}

export const OrderSchema = new Schema<Order>(
    {
        customerId: { type: String, required: true },
        cartId: { type: String, required: true, unique: true },
        status: {
            type: String,
            required: true,
            enum: OrderStatus,
            default: OrderStatus.PENDING
        },
    },
    {
        timestamps: true,
    },
);

export const OrderModel = mongoose.model<Order>(DatabaseModel.ORDER, OrderSchema);
