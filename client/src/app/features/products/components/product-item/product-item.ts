import { Component, Input } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-item',
  imports: [RouterModule],
  templateUrl: './product-item.html',
  styleUrl: './product-item.scss'
})
export class ProductItem {
  @Input() product: IProduct = {
    _id: "",
    name: "",
    description: "",
    price: 0,
    collections: [],
    variants: [],
    imageUrls: [],
    options: []
  };
}
