import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus } from "src/common/enums/order-status.enum";
import { DatabaseModel } from "src/common/enums/database-model.enum";
import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { Address, AddressSchema } from "src/common/schemas/address.schema";
import { ObjectId } from "mongodb";

export interface Order extends Document {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;

    cartId: ObjectId;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingAddress: Address;
}

export const OrderSchema = new Schema<Order>(
    {
        cartId: { type: Schema.Types.ObjectId, ref: DatabaseModel.CART, required: true, unique: true },
        status: { type: String, required: true, enum: OrderStatus, default: OrderStatus.PENDING },
        paymentStatus: { type: String, required: true, enum: PaymentStatus, default: PaymentStatus.PENDING },
        shippingAddress: { type: AddressSchema },
    },
    {
        timestamps: true,
    },
);

export const OrderModel = mongoose.model<Order>(DatabaseModel.ORDER, OrderSchema);
