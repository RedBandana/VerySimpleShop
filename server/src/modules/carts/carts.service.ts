import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICart } from './schemas/cart.schema';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetCartsDto } from './dto/get-carts.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { DatabaseCollectionService } from 'src/services/database-collection/database-collection.service';
import { ObjectId } from 'mongodb';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartsService extends DatabaseCollectionService {
    private readonly logger = new Logger(CartsService.name);

    constructor(
        @InjectModel(DatabaseModel.CART) protected readonly cartModel: Model<ICart>,
        protected productsService: ProductsService
    ) {
        super(cartModel);
    }

    async create(createCartDto: CreateCartDto): Promise<ICart> {
        return await this.createDocument(createCartDto);
    }

    async getAll(getCartsDto: GetCartsDto): Promise<{ carts: ICart[]; total: number; page: number; limit: number }> {
        const { page = 1, limit = 10, userId, orderId } = getCartsDto;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (userId) filter.userId = userId;
        if (orderId) filter.orderId = orderId;

        const [carts, total] = await Promise.all([
            this.filterBy(filter, { skip, limit }),
            this.cartModel.countDocuments(filter).lean().exec(),
        ]);

        return { carts, total, page, limit, };
    }

    async get(cartId: ObjectId): Promise<ICart> {
        const cart = await this.getDocument(cartId);
        return cart;
    }

    async update(cartId: ObjectId, updateCartDto: UpdateCartDto): Promise<ICart> {
        const cart = await this.updateDocument(cartId, updateCartDto);
        return cart;
    }

    async delete(cartId: ObjectId): Promise<void> {
        await this.deleteDocument(cartId);
    }

    async getByUserId(userId: ObjectId): Promise<ICart | null> {
        return await this.filterOneBy({ userId, orderId: null }, false);
    }

    async addToCart(userId: ObjectId, addToCartDto: AddToCartDto): Promise<ICart> {
        const product = await this.productsService.getDocument(addToCartDto.productId);
        if (!product) throw new Error('Product not found');

        if (addToCartDto.variantId) {
            const productVariantIds = product.variants.map(v => v._id.toString());
            if (!productVariantIds.includes(addToCartDto.variantId))
                throw new Error('Product not found');
        }

        let cart = await this.getByUserId(userId);
        if (!cart) cart = await this.create({ userId, items: [], totalPrice: 0 });

        const existingItemIndex = cart.items.findIndex(item =>
            item.productId.toString() === addToCartDto.productId.toString() &&
            item.variantId?.toString() === addToCartDto.variantId?.toString()
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += addToCartDto.quantity;
        } else {
            cart.items.push({
                productId: addToCartDto.productId,
                variantId: addToCartDto.variantId,
                quantity: addToCartDto.quantity
            });
            // Saving now so virtual property _product get added.
            await (cart as any).save();
        }

        await this.calculateTotalPrice(cart);
        await (cart as any).save();

        return cart;
    }

    async updateCartItem(userId: ObjectId, updateCartDto: UpdateCartDto): Promise<ICart> {
        const cart = await this.getByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(item =>
            item.productId.toString() === updateCartDto.productId.toString() &&
            item.variantId?.toString() === updateCartDto.variantId?.toString()
        );

        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }

        if (updateCartDto.quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = updateCartDto.quantity;
        }

        await this.calculateTotalPrice(cart);
        await (cart as any).save();

        return cart;
    }

    async removeFromCart(userId: ObjectId, removeFromCartDto: RemoveFromCartDto): Promise<ICart> {
        const cart = await this.getByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(item =>
            item.productId.toString() === removeFromCartDto.productId.toString() &&
            item.variantId?.toString() === removeFromCartDto.variantId?.toString()
        );

        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }

        const currentQuantity = cart.items[itemIndex].quantity;
        const newQuantity = currentQuantity - removeFromCartDto.quantity;

        if (newQuantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = newQuantity;
        }

        await this.calculateTotalPrice(cart);
        await (cart as any).save();

        return cart;
    }

    async clearCart(userId: ObjectId): Promise<ICart> {
        const cart = await this.getByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = [];
        cart.totalPrice = 0;

        await (cart as any).save();

        return cart;
    }

    private async calculateTotalPrice(cart: ICart): Promise<void> {
        let totalPrice = 0;

        for (const item of cart.items) {
            if (!item._product) throw new Error('Product not found');

            if (item.variantId && (item._product.variants.length ?? 0) > 0) {
                const variantIndex = item._product.variants.findIndex(
                    v => v._id.toString() === item.variantId?.toString()
                );

                if (variantIndex >= 0 && item._product.variants[variantIndex].price) {
                    totalPrice += item._product.variants[variantIndex].price * item.quantity;
                    continue;
                }
            }

            totalPrice += item._product.price * item.quantity;
        }

        cart.totalPrice = totalPrice;
    }
}
