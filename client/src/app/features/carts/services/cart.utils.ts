import { NO_IMAGE_URL } from "../../../core/constants/general.constant";
import { IProductVariant } from "../../products";
import { ICartItem } from "../models/cart.model";

export class CartUtils {
  static getVariant(cartItem: ICartItem): IProductVariant | undefined {
    if (!cartItem.variantId) return;

    const variant = cartItem._product?.variants.find(v => v._id === cartItem.variantId);
    return variant;
  }

  static getVariantName(cartItem: ICartItem): string {
    return this.getVariant(cartItem)?.name ?? "";
  }

  static getFullName(cartItem: ICartItem): string {
    if (!cartItem._product) return "";

    const variantName = this.getVariant(cartItem)?.name ?? "";
    if (!variantName) return cartItem._product.name;

    return `${cartItem._product.name} ${variantName}`
  }

  static getItemImageUrl(cartItem: ICartItem): string {
    const variant = this.getVariant(cartItem);
    if (variant?.imageUrls && variant.imageUrls.length > 0)
      return variant?.imageUrls[0] || NO_IMAGE_URL;

    return cartItem._product?.imageUrls[0] || NO_IMAGE_URL;
  }

  static getItemPrice(cartItem: ICartItem) {
    let unitPrice = cartItem._product?.price ?? 0;
    if (cartItem.variantId && cartItem._product) {
      const variantIndex = cartItem._product.variants.findIndex(v => v._id === cartItem.variantId);
      if (variantIndex !== -1) {
        const variantPrice = cartItem._product.variants[variantIndex].price;
        if (variantPrice) unitPrice = variantPrice;
      }
    }

    return unitPrice;
  }

  static getItemFullPrice(cartItem: ICartItem) {
    const unitPrice = this.getItemPrice(cartItem);
    return unitPrice * cartItem.quantity;
  }
}
