import { Schema } from "mongoose";

export interface ProductVariant {
    sku?: string;
    specifications: any; // e.g., { size: "M", color: "Red" }
    imageUrls?: string[];
    price?: number;
    stock?: number;
}

export const ProductVariantSchema = new Schema<ProductVariant>({
    sku: { type: String, required: false },
    specifications: { type: Object, required: true }, // Using Map for dynamic attributes
    imageUrls: { type: [String], required: false },
    price: { type: Number, required: false },
    stock: { type: Number, required: false },
});
