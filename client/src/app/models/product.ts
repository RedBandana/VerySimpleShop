export interface IProduct {
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    collections: string[];
    options: IProductOption[];
    variants: IProductVariant[];
}

export interface IProductOption {
    name: string; // e.g., "Color" or "Size"
    choices: IProductOptionChoice[];
}

export interface IProductOptionChoice {
    value: string; // e.g., "Red" or "M"
    imageUrl?: string;
}

export interface IProductVariant {
    sku?: string;
    attributes: { [key: string]: string }; // e.g., { size: "M", color: "Red" }
    imageUrls: string[];
    price?: number;
    stock?: number;
}
