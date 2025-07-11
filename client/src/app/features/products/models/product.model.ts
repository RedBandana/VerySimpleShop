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
    choices: IProductOptionChoice[];
}

export interface IProductOptionChoice {
    _id?: string;
    value: string;
    imageUrl?: string;
}

export interface IProductVariant {
    _id?: string;
    sku?: string;
    specifications: { [key: string]: string };
    imageUrls: string[];
    price?: number;
    stock?: number;
}
