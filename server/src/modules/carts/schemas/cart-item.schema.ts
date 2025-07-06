import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { DatabaseModel } from "src/common/enums/database-model.enum";
import { Product } from "src/modules/products/schemas/product.schema";

export interface CartItem {
    productId: ObjectId;
    variantId?: ObjectId;
    quantity: number;
    
    _product?: Product;
}

export const CartItemSchema = new Schema<CartItem>({
    productId: { type: Schema.Types.ObjectId, ref: DatabaseModel.PRODUCT, required: true },
    variantId: { type: Schema.Types.ObjectId, required: false },
    quantity: { type: Number, required: true, min: 1 },
});

CartItemSchema.virtual('_product', {
    ref: DatabaseModel.PRODUCT,
    localField: 'productId',
    foreignField: '_id',
    justOne: true,
});

