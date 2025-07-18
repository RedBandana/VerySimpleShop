import { Component, Input } from '@angular/core';
import { IProduct } from '../../models/product.model';
import { RouterModule } from '@angular/router';
import { NO_IMAGE_URL } from '../../../../core/constants/general.constant';

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

  get imageUrl(): string {
    if (this.product.variants.length === 0)
      return this.product.imageUrls[0];

    const variant = this.product.variants[0];
    if (variant.imageUrls.length > 0)
      return variant.imageUrls[0] || NO_IMAGE_URL;

    return this.product.imageUrls[0] || NO_IMAGE_URL;
  }
}
