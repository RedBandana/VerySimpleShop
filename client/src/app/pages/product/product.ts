import { Component, Input } from '@angular/core';
import { IProduct } from '../../models/product';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-product',
  imports: [MarkdownModule],
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class Product {
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
        values: [
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
        attributes: { color: "jet_black" },
        imageUrls: [],
        price: 30
      },
      {
        id: "2",
        attributes: { color: "dark_brown" },
        imageUrls: [],
        price: 30
      },
      {
        id: "3",
        attributes: { color: "beige_blonde" },
        imageUrls: [],
        price: 30
      },
      {
        id: "4",
        attributes: { color: "platinum_blonde" },
        imageUrls: [],
        price: 30
      },
      {
        id: "5",
        attributes: { color: "balayage_choco" },
        imageUrls: [],
        price: 30
      },
      {
        id: "6",
        attributes: { color: "balayage_sun_kiss" },
        imageUrls: [],
        price: 30
      }
    ]
  };

  get collections(): string {
    return this.product.collections.join(", ");
  }
}
