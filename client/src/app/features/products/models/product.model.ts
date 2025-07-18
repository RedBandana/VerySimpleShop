export interface IProduct {
    _id?: string;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    collections: string[];
    options: IProductOption[];
    variants: IProductVariant[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProductOption {
    _id?: string;
    name: string;
    nameKey: string;
    choices: IProductOptionChoice[];
}

export interface IProductOptionChoice {
    _id?: string;
    value: string;
    valueKey: string;
    imageUrl?: string;
}

export interface IProductVariant {
    _id?: string;
    name: string;
    specifications: { [key: string]: string };
    sku?: string;
    imageUrls: string[];
    price?: number;
    stock?: number;
}
