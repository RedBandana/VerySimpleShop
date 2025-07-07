import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus } from "src/common/enums/order-status.enum";
import { DatabaseModel } from "src/common/enums/database-model.enum";
import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { IAddress, AddressSchema } from "src/common/schemas/address.schema";
import { ObjectId } from "mongodb";
import { ICart } from "src/modules/carts/schemas/cart.schema";
import { IUser } from "src/modules/users/schemas/user.schema";

export interface IOrder extends Document {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;

    userId: ObjectId;
    cartId: ObjectId;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingAddress: IAddress;

    sessionId?: string;
    sessionUrl?: string;

    _cart?: ICart;
    _user: IUser;
}

export const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: DatabaseModel.USER, required: false },
        cartId: { type: Schema.Types.ObjectId, ref: DatabaseModel.CART, required: true, unique: true },
        status: { type: String, required: true, enum: OrderStatus, default: OrderStatus.PENDING },
        paymentStatus: { type: String, required: true, enum: PaymentStatus, default: PaymentStatus.PENDING },
        shippingAddress: { type: AddressSchema },
        sessionId: { type: String, required: false },
        sessionUrl: { type: String, required: false },
    },
    {
        timestamps: true,
    },
);

OrderSchema.virtual('_user', {
    ref: DatabaseModel.USER,
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

OrderSchema.virtual('_cart', {
    ref: DatabaseModel.CART,
    localField: 'cartId',
    foreignField: '_id',
    justOne: true,
});

function populateVirtualFields(obj: any) {
    obj.populate({
        path: "_user",
        options: {
            select: "firstName lastName email",
            _recursed: true,
        },
    });

    obj.populate({
        path: "_cart",
        options: {
            select: "userId items totalPrice",
            _recursed: true
        },
    });
}

function populateVirtualFieldsLean(obj: any) {
    obj.populate({
        path: "_user",
        options: {
            select: "email",
            _recursed: true,
        },
    });

    obj.populate({
        path: "_cart",
        options: {
            select: "userId totalPrice",
            _recursed: true,
        },
    });
}

function preFind(next: any) {
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

async function preUpdate(next: any) {
    try {
        const update: any = this.getUpdate();
        if (update.cartId) {
            const cartModel = this.constructor.db.model(DatabaseModel.CART);

            const beforeUpdateOrder = await this.model.findOne(this.getQuery()).select('cartId');
            if (beforeUpdateOrder?.cartId?.toString() !== update.cartId.toString()) {
                await cartModel.findByIdAndUpdate(beforeUpdateOrder.cartId, { $unset: { orderId: "" } });
            }

            const cart = await cartModel.findByIdAndUpdate(update.cartId, { orderId: beforeUpdateOrder._id }, { new: true });
            if (cart) update.userId = cart.userId;
        }

        if (!this.options?._recursed) {
            if (this.options?._lean) populateVirtualFieldsLean(this);
            else populateVirtualFields(this);
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

async function preSave(next: any) {
    try {
        if (this.isModified('cartId')) {
            const cartModel = this.constructor.db.model(DatabaseModel.CART);

            if (this.isNew === false) {
                const previousOrder = await this.constructor.findById(this._id).select('cartId');
                if (previousOrder?.cartId?.toString() !== this.cartId.toString()) {
                    await cartModel.findByIdAndUpdate(previousOrder.cartId, { $unset: { orderId: "" } });
                }
            }

            const cart = await cartModel.findByIdAndUpdate(this.cartId, { orderId: this._id }, { new: true });
            if (cart) this['userId'] = cart.userId;
        }

        if (!this.options?._recursed) {
            if (this.options?._lean) populateVirtualFieldsLean(this);
            else populateVirtualFields(this);
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

OrderSchema.pre('find', preFind);
OrderSchema.pre('findOne', preFind);
OrderSchema.pre('findOneAndReplace', preUpdate);
OrderSchema.pre('findOneAndUpdate', preUpdate);
OrderSchema.pre('replaceOne', preUpdate);
OrderSchema.pre('updateOne', preUpdate);
OrderSchema.pre('updateMany', preUpdate);
OrderSchema.pre('save', preSave);

export const OrderModel = mongoose.model<IOrder>(DatabaseModel.ORDER, OrderSchema);
