import { ObjectId } from "mongodb";
import { Schema } from "mongoose";

export interface IProductVariant {
    _id: ObjectId;

    sku?: string;
    name: string;
    specifications: any; // e.g., { size: "M", color: "Red" }
    imageUrls?: string[];
    price?: number;
    stock?: number;
}

export const ProductVariantSchema = new Schema<IProductVariant>({
    name: { type: String, required: true },
    specifications: { type: Object, required: true },
    sku: { type: String, required: false },
    imageUrls: { type: [String], required: false },
    price: { type: Number, required: false },
    stock: { type: Number, required: false },
});
