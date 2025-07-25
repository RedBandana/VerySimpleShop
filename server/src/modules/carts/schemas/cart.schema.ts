import mongoose, { Schema } from "mongoose";
import { CartItemSchema, ICartItem } from "./cart-item.schema";
import { DatabaseModel } from "src/common/enums/database-model.enum";
import { ObjectId } from "mongodb";
import { IUser } from "src/modules/users/schemas/user.schema";
import { IOrder } from "src/modules/orders/schemas/order.schema";

export interface ICart extends Document {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;

    userId: ObjectId;
    orderId?: ObjectId;
    items: ICartItem[];
    totalPrice: number;

    _user?: IUser;
    _order?: IOrder;
}

export const CartSchema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: DatabaseModel.USER, required: true },
        items: { type: [CartItemSchema], required: true },
        totalPrice: { type: Number, required: true, default: 0 },
        orderId: { type: Schema.Types.ObjectId, ref: DatabaseModel.ORDER, default: null, required: false },
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
                    { $ne: "" }
                ]
            }
        }
    }
);

CartSchema.virtual('_user', {
    ref: DatabaseModel.USER,
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

CartSchema.virtual('_order', {
    ref: DatabaseModel.ORDER,
    localField: 'orderId',
    foreignField: '_id',
    justOne: true,
});

function populateVirtualFields(obj: any) {
    obj.populate({
        path: "items._product",
        options: {
            _recursed: true,
        },
    });

    obj.populate({
        path: "_user",
        options: {
            _recursed: true,
        },
    });

    obj.populate({
        path: "_order",
        options: {
            _recursed: true,
        },
    });
}

function populateVirtualFieldsLean(obj: any) {
    obj.populate({
        path: "items._product",
        options: {
            select: "name price imageUrls variants._id variants.price variants.stock variants.imageUrls variants.name",
            _recursed: true,
        },
    });

    obj.populate({
        path: "_user",
        options: {
            select: "firstName lastName email",
            _recursed: true,
        },
    });

    obj.populate({
        path: "_order",
        options: {
            select: "status paymentStatus sessionUrl sessionId",
            _recursed: true,
        },
    });
}

function preOperation(next: any) {
    try {
        if (!this.options?._recursed) {
            if (this.options?._lean) populateVirtualFieldsLean(this);
            else populateVirtualFields(this);
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

CartSchema.pre('find', preOperation);
CartSchema.pre('findOne', preOperation);
CartSchema.pre('findOneAndReplace', preOperation);
CartSchema.pre('findOneAndUpdate', preOperation);
CartSchema.pre('replaceOne', preOperation);
CartSchema.pre('updateOne', preOperation);
CartSchema.pre('updateMany', preOperation);
CartSchema.pre('save', preOperation);

export const CartModel = mongoose.model<ICart>(DatabaseModel.CART, CartSchema);
