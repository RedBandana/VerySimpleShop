import { Component, Input } from '@angular/core';
import { IProduct } from '../../models/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list-item',
  imports: [RouterModule],
  templateUrl: './product-list-item.html',
  styleUrl: './product-list-item.scss'
})
export class ProductListItem {
  @Input() product: IProduct = {
    name: "",
    collections: [""],
    description: "",
    variants: [],
    price: 0,
    imageUrls: [],
    id: '',
    options: []
  };
}
