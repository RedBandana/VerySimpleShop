import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
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
    return this.apiService.get<IProductsResponse>(this.endpoint, params).pipe(
      map(response => response.data)
    );
  }

  getProduct(productId: string): Observable<IProduct> {
    return this.apiService.get<IProduct>(`${this.endpoint}/${productId}`).pipe(
      map(response => response.data)
    );
  }

  createProduct(product: ICreateProductRequest): Observable<IProduct> {
    return this.apiService.post<IProduct>(this.endpoint, product).pipe(
      map(response => response.data)
    );
  }

  updateProduct(productId: string, product: IUpdateProductRequest): Observable<IProduct> {
    return this.apiService.put<IProduct>(`${this.endpoint}/${productId}`, product).pipe(
      map(response => response.data)
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${productId}`).pipe(
      map(() => void 0)
    );
  }
}