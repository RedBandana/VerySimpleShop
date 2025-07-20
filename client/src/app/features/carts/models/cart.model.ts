import { NO_IMAGE_URL } from "../../../core/constants/general.constant";
import { LocalizationService } from "../../../core/services/localization.service";
import { IProduct, IProductVariant } from "../../products";

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  isGuestCart: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  _id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  _product?: IProduct;
}
