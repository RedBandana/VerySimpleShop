import { ObjectId } from "mongodb";
import { Schema } from "mongoose";

export interface IProductVariant {
    _id: ObjectId;

    sku?: string;
    specifications: any; // e.g., { size: "M", color: "Red" }
    imageUrls?: string[];
    price?: number;
    stock?: number;
}

export const ProductVariantSchema = new Schema<IProductVariant>({
    sku: { type: String, required: false },
    specifications: { type: Object, required: true }, // Using Map for dynamic attributes
    imageUrls: { type: [String], required: false },
    price: { type: Number, required: false },
    stock: { type: Number, required: false },
});
