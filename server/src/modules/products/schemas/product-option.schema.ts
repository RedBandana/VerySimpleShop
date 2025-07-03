import { Schema } from "mongoose";

export interface ProductOption {
    name: string; // e.g., "Color" or "Size"
    choices: ProductOptionChoice[];
}

export interface ProductOptionChoice {
    value: string; // e.g., "Red" or "M"
    imageUrl?: string;
}

const ProductOptionChoiceSchema = new Schema<ProductOptionChoice>({
    value: { type: String, required: true },
    imageUrl: { type: String, required: false },
});

export const ProductOptionSchema = new Schema<ProductOption>({
    name: { type: String, required: true },
    choices: { type: [ProductOptionChoiceSchema], required: true },
});
