import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { ProductItem } from '../../components/product-item/product-item';
import { ButtonToggle } from '../../../../shared/components/inputs/button-toggle/button-toggle';
import { Store } from '@ngrx/store';
import { loadProducts, selectProducts } from '../../store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-featured-products',
  imports: [AsyncPipe, ButtonToggle, ProductItem],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProducts implements OnInit {

  trending: string[] = ["New In", "Popular", "Sale"];
  products$: Observable<IProduct[]> | undefined;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(loadProducts({ request: undefined }));
    this.products$ = this.store.select(selectProducts);
  }
}
