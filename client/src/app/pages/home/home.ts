import { Component } from '@angular/core';
import { IProduct } from '../../features/products/models/product.model';
import { ButtonToggle } from "../../components/inputs/button-toggle/button-toggle";
import { ProductListItem } from '../../components/product-list-item/product-list-item';

@Component({
  selector: 'app-home',
  imports: [ButtonToggle, ProductListItem],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  trending: string[] = ["New In", "Popular", "Sale", "Crochet Braid", "Half Wig", "Ponytail"];


  product: IProduct = {
    id: "random",
    name: "Outre Quick Weave Synthetic Half Wig - Susannah",
    price: 30,
    collections: ["Synthetic Wig", "Half Wig"],
    description: "- Straight Style with Layers for an Easygoing Style\n- Pre-teased Modern Pouf Style with Refined Volume\n- Virtually Undetectable HD Lace \n- Baby Hairs for a Flawless Hairline\n- An Essential Addition to Your Wig Stash\n- Made with Heat Resistant Fiber\n- Available in Fashion-Forward Colors\n- Dress It Up or Dress It Down\n- Heat Styling Safe Up To 350° - 400°F\n- Material: Synthetic Fiber\n- Style: Straight\n- Length: 24\"\n- Color Shown: **Beige Blonde**",
    imageUrls: [
      "https://hairsoflyshop.com/cdn/shop/files/sensationnel-instant-weave-half-wig-updo-iwd-23-1171395290_2048x2048.jpg",
      "https://hairsoflyshop.com/cdn/shop/files/sensationnel-instant-weave-half-wig-updo-iwd-23-1171395287_2048x2048.jpg",
      "https://hairsoflyshop.com/cdn/shop/files/sensationnel-instant-weave-half-wig-updo-iwd-23-1171395289_2048x2048.jpg",
      "https://hairsoflyshop.com/cdn/shop/files/sensationnel-instant-weave-half-wig-updo-iwd-23-1171395288_2048x2048.jpg"
    ],
    options: [
      {
        id: "color",
        name: "Color",
        choices: [
          {
            id: "jet_black",
            value: "Jet Black",
            imageUrl: "https://hairsoflyshop.com/cdn/shop/t/90/assets/1-jet-black.png"
          },
          {
            id: "dark_brown",
            value: "Dark Brown",
            imageUrl: "https://hairsoflyshop.com/cdn/shop/t/90/assets/2-dark-brown.png"
          },
          {
            id: "beige_blonde",
            value: "Beige Blonde",
            imageUrl: "https://hairsoflyshop.com/cdn/shop/t/90/assets/beigeblonde.png"
          },
          {
            id: "platinum_blonde",
            value: "Platinum Blonde",
            imageUrl: "https://hairsoflyshop.com/cdn/shop/t/90/assets/platinumblonde.png"
          },
          {
            id: "balayage_choco",
            value: "Balayage Choco",
            imageUrl: "https://hairsoflyshop.com/cdn/shop/t/90/assets/balayagechocolate.png"
          },
          {
            id: "balayage_sun_kiss",
            value: "Balayage Sun Kiss",
            imageUrl: "https://hairsoflyshop.com/cdn/shop/t/90/assets/balayagesunkissed.png"
          }
        ]
      }
    ],
    variants: [
      {
        id: "1",
        specifications: { color: "jet_black" },
        imageUrls: [],
        price: 30
      },
      {
        id: "2",
        specifications: { color: "dark_brown" },
        imageUrls: [],
        price: 30
      },
      {
        id: "3",
        specifications: { color: "beige_blonde" },
        imageUrls: [],
        price: 30
      },
      {
        id: "4",
        specifications: { color: "platinum_blonde" },
        imageUrls: [],
        price: 30
      },
      {
        id: "5",
        specifications: { color: "balayage_choco" },
        imageUrls: [],
        price: 30
      },
      {
        id: "6",
        specifications: { color: "balayage_sun_kiss" },
        imageUrls: [],
        price: 30
      }
    ]
  };

  products: IProduct[] = [
    this.product, this.product, this.product, this.product, this.product, this.product,
    this.product, this.product, this.product, this.product, this.product, this.product,
  ]
}
