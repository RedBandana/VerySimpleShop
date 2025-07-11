import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedApiResponse } from '../../../core/interfaces/api-response.interface';
import {
  ICreateProductRequest,
  IGetProductsRequest,
  IProduct,
  IProductsResponse,
  IUpdateProductRequest
} from '../../products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = 'products';

  constructor(private apiService: ApiService) { }

  getProducts(params?: IGetProductsRequest): Observable<IProductsResponse> {
    return this.apiService.getPaginated<IProduct>(this.endpoint, params).pipe(
      map(response => ({
        products: response.data,
        total: response.pagination.total,
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages
      }))
    );
  }

  getProductsPaginated(params?: IGetProductsRequest): Observable<PaginatedApiResponse<IProduct>> {
    return this.apiService.getPaginated<IProduct>(this.endpoint, params);
  }

  getProduct(productId: string): Observable<IProduct> {
    return this.apiService.get<IProduct>(`${this.endpoint}/${productId}`);
  }

  createProduct(product: ICreateProductRequest): Observable<IProduct> {
    return this.apiService.post<IProduct>(this.endpoint, product);
  }

  updateProduct(productId: string, product: IUpdateProductRequest): Observable<IProduct> {
    return this.apiService.put<IProduct>(`${this.endpoint}/${productId}`, product);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${productId}`);
  }
}