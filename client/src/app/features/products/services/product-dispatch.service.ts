import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductState, resetProductSuccessStates, startGetAllProducts, startGetProduct } from '../store';
import { LogService } from '../../../core/services/log.service';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { IGetProductsRequest } from '../models/product-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProductDispatchService {
  private logService: LogService = new LogService(ProductDispatchService.name);
  state?: ProductState;

  get subscription() {
    return this.store.select((state) => state.product);
  }

  constructor(private store: Store<{ product: ProductState }>) {
    this.subscribeNgRx();
  }

  private subscribeNgRx() {
    this.store
      .select((state) => state.product)
      .subscribe((productState) => {
        if (!productState) return;
        this.state = productState;
        this.resetProductSuccessStates();
      });
  }

  private resetProductSuccessStates() {
    if (this.state?.success) {
      this.logService.log('resetProductSuccessStates');
      this.store.dispatch(resetProductSuccessStates());
    }
  }

  private waitForLoadingToEnd(): Observable<boolean> {
    return this.store
      .select((state) => state.product.loading)
      .pipe(
        filter((loading) => !loading),
        take(1),
      );
  }

  getAllProducts(request?: IGetProductsRequest) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startGetAllProducts');
      this.store.dispatch(startGetAllProducts({ request }))
    });
  }

  getProduct(productId: string) {
    this.waitForLoadingToEnd().subscribe(() => {
      this.logService.log('startGetProduct');
      this.store.dispatch(startGetProduct({ productId }))
    });
  }
}
