import { SortBy, SortOrder } from "../../../core/enums/sort.enum";
import { IProduct, IProductOption, IProductVariant } from "./product.model";

export interface ICreateProductRequest {
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    collections: string[];
    options: IProductOption[];
    variants: IProductVariant[];
}

export interface IUpdateProductRequest extends Partial<ICreateProductRequest> { }

export interface IGetProductsRequest {
    page?: number;
    limit?: number;
    search?: string;
    collections?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
}

export interface IProductsPagination {
    products: IProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
