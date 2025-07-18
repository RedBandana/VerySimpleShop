import mongoose, { Schema, Document } from "mongoose";
import { IProductOption, ProductOptionSchema } from "./product-option.schema";
import { IProductVariant, ProductVariantSchema } from "./product-variant.schema";
import { DatabaseModel } from "src/common/enums/database-model.enum";
import { ObjectId } from "mongodb";

export interface IProduct extends Document {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;

    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    collections: string[];
    options: IProductOption[];
    variants: IProductVariant[];
}

export const ProductSchema = new Schema<IProduct>(
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

export const ProductModel = mongoose.model<IProduct>(DatabaseModel.PRODUCT, ProductSchema);
