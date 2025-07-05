import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetCartsDto } from './dto/get-carts.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { DatabaseCollectionService } from 'src/services/database-collection/database-collection.service';

@Injectable()
export class CartsService extends DatabaseCollectionService {

    constructor(
        @InjectModel(DatabaseModel.CART) protected readonly cartModel: Model<Cart>,
    ) {
        super(cartModel);
    }

    async create(createCartDto: CreateCartDto): Promise<Cart> {
        const cart = await this.createDocument(createCartDto);
        return cart;
    }

    async getAll(getCartsDto: GetCartsDto): Promise<{ carts: Cart[]; total: number; page: number; limit: number }> {
        const { page = 1, limit = 10, userId, orderId } = getCartsDto;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (userId) {
            filter.userId = userId;
        }

        if (orderId) {
            filter.orderId = orderId;
        }

        const [carts, total] = await Promise.all([
            this.cartModel.find(filter).skip(skip).limit(limit).lean().exec(),
            this.cartModel.countDocuments(filter).lean().exec(),
        ]);

        return {
            carts,
            total,
            page,
            limit,
        };
    }

    async get(id: string): Promise<Cart> {
        const cart = await this.getDocument(id);
        return cart;
    }

    async update(id: string, updateCartDto: any): Promise<Cart> {
        const cart = await this.updateDocument(id, updateCartDto);
        return cart;
    }

    async delete(id: string): Promise<void> {
        await this.deleteDocument(id);
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        return await this.cartModel.findOne({ userId }).exec();
    }

    async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
        let cart = await this.findByUserId(userId);

        if (!cart) {
            cart = new this.cartModel({
                userId,
                items: [],
                totalPrice: 0
            });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.productId === addToCartDto.productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += addToCartDto.quantity;
        } else {
            cart.items.push({
                productId: addToCartDto.productId,
                quantity: addToCartDto.quantity
            });
        }

        await this.calculateTotalPrice(cart);
        await (cart as any).save();

        return cart;
    }

    async updateCartItem(userId: string, updateCartDto: UpdateCartDto): Promise<Cart> {
        const cart = await this.findByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId === updateCartDto.productId
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

    async removeFromCart(userId: string, removeFromCartDto: RemoveFromCartDto): Promise<Cart> {
        const cart = await this.findByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId === removeFromCartDto.productId
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

    async clearCart(userId: string): Promise<Cart> {
        const cart = await this.findByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = [];
        cart.totalPrice = 0;

        await (cart as any).save();

        return cart;
    }

    private async calculateTotalPrice(cart: Cart): Promise<void> {
        // For now, we'll set totalPrice to 0 as we need ProductsService to calculate actual prices
        // In a real implementation, you'd inject ProductsService and calculate based on product prices
        cart.totalPrice = 0;
    }
}
