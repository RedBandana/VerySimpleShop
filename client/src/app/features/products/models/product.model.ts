export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    collections: string[];
    options: IProductOption[];
    variants: IProductVariant[];
}

export interface IProductOption {
    id: string;
    name: string; // e.g., "Color" or "Size"
    choices: IProductOptionChoice[];
}

export interface IProductOptionChoice {
    id: string;
    value: string; // e.g., "Red" or "M"
    imageUrl?: string;
}

export interface IProductVariant {
    id: string;
    sku?: string;
    specifications: { [key: string]: string }; // e.g., { size: "M", color: "Red" }
    imageUrls: string[];
    price?: number;
    stock?: number;
}
