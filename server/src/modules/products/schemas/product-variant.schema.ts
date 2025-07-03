import { Schema } from "mongoose";

export interface ProductVariant {
    sku?: string;
    attributes: { [key: string]: string }; // e.g., { size: "M", color: "Red" }
    imageUrls: string[];
    price?: number;
    stock?: number;
}

export const ProductVariantSchema = new Schema<ProductVariant>({
    sku: { type: String, required: false },
    attributes: { type: Map, of: String, required: true }, // Using Map for dynamic attributes
    imageUrls: { type: [String], required: true },
    price: { type: Number, required: false },
    stock: { type: Number, required: false },
});
