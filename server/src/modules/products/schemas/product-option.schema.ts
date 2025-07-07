import { Schema } from "mongoose";

export interface IProductOption {
    name: string; // e.g., "Color" or "Size"
    choices: IProductOptionChoice[];
}

export interface IProductOptionChoice {
    value: string; // e.g., "Red" or "M"
    imageUrl?: string;
}

const ProductOptionChoiceSchema = new Schema<IProductOptionChoice>({
    value: { type: String, required: true },
    imageUrl: { type: String, required: false },
});

export const ProductOptionSchema = new Schema<IProductOption>({
    name: { type: String, required: true },
    choices: { type: [ProductOptionChoiceSchema], required: true },
});
