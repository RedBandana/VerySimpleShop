export interface IProduct {
    id?: string;
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
    id?: string;
    name: string;
    choices: IProductOptionChoice[];
}

export interface IProductOptionChoice {
    id?: string;
    value: string;
    imageUrl?: string;
}

export interface IProductVariant {
    id?: string;
    sku?: string;
    specifications: { [key: string]: string };
    imageUrls: string[];
    price?: number;
    stock?: number;
}
