import mongoose, { Schema, Document } from "mongoose";
import { ProductOption, ProductOptionSchema } from "./product-option.schema";
import { ProductVariant, ProductVariantSchema } from "./product-variant.schema";
import { DatabaseModel } from "src/common/enums/database-model.enum";

export interface Product extends Document {
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    collections: string[];
    options: ProductOption[];
    variants: ProductVariant[];
    createdAt: Date;
    updatedAt: Date;
}

export const ProductSchema = new Schema<Product>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrls: { type: [String], required: true },
        collections: { type: [String], required: true },
        options: { type: [ProductOptionSchema], required: true },
        variants: { type: [ProductVariantSchema], required: true },
    },
    {
        timestamps: true,
    },
);

export const ProductModel = mongoose.model<Product>(DatabaseModel.PRODUCT, ProductSchema);
