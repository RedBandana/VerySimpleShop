import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrder } from './schemas/order.schema';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { DatabaseCollectionService } from 'src/services/database-collection/database-collection.service';
import { ObjectId } from 'mongodb';
import { StripeService } from 'src/services/stripe/stripe.service';
import { CartsService } from '../carts/carts.service';
import { ICartItem } from '../carts/schemas/cart-item.schema';
import { IStripeItem } from 'src/common/interfaces/stripe-item.interface';

@Injectable()
export class OrdersService extends DatabaseCollectionService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        @InjectModel(DatabaseModel.ORDER) protected readonly orderModel: Model<IOrder>,
        protected readonly cartsService: CartsService,
        private readonly stripeService: StripeService
    ) {
        super(orderModel);
    }

    async create(createOrderDto: CreateOrderDto): Promise<IOrder> {
        const order = await this.createDocument(createOrderDto);
        return order;
    }

    async getAll(getOrdersDto: GetOrdersDto): Promise<{ orders: IOrder[]; total: number; page: number; limit: number }> {
        const { page = 1, limit = 10, cartId, status, paymentStatus, userId } = getOrdersDto;
        const skip = (page - 1) * limit;
        const filter: any = {};

        if (userId) filter.userId = userId;
        if (cartId) filter.cartId = cartId;
        if (status) filter.status = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

        const [orders, total] = await Promise.all([
            this.filterBy(filter, { skip, limit }),
            this.orderModel.countDocuments(filter).lean().exec(),
        ]);

        return {
            orders,
            total,
            page,
            limit,
        };
    }

    async get(orderId: ObjectId): Promise<IOrder> {
        const order = await this.getDocument(orderId);
        return order;
    }

    async update(orderId: ObjectId, updateOrderDto: UpdateOrderDto): Promise<IOrder> {
        const order = await this.updateDocument(orderId, updateOrderDto);
        return order;
    }

    async delete(orderId: ObjectId): Promise<void> {
        await this.deleteDocument(orderId);
    }

    async findByCartId(cartId: ObjectId): Promise<IOrder | null> {
        return await this.filterOneBy({ cartId });
    }

    async updateOrderStatus(orderId: ObjectId, updateOrderStatusDto: UpdateOrderStatusDto): Promise<IOrder> {
        const order = await this.updateDocument(orderId, { status: updateOrderStatusDto.status });
        return order;
    }

    async updatePaymentStatus(orderId: ObjectId, updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<IOrder> {
        const order = await this.updateDocument(orderId, { paymentStatus: updatePaymentStatusDto.paymentStatus });
        return order;
    }

    async getOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
        return await this.orderModel.find({ status }).exec();
    }

    async getOrdersByPaymentStatus(paymentStatus: PaymentStatus): Promise<IOrder[]> {
        return await this.orderModel.find({ paymentStatus }).exec();
    }

    async cancelOrder(orderId: ObjectId): Promise<IOrder> {
        const order = await this.get(orderId);

        if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
            throw new Error('Cannot cancel order that has been shipped or delivered');
        }

        return await this.updateDocument(orderId, {
            status: OrderStatus.CANCELLED
        });
    }

    async completeOrder(orderId: ObjectId): Promise<IOrder> {
        const order = await this.get(orderId);

        if (order.paymentStatus !== PaymentStatus.PAID) {
            throw new Error('Cannot complete order with unpaid payment status');
        }

        return await this.updateDocument(orderId, {
            status: OrderStatus.COMPLETED
        });
    }

    async createOrderFromCart(cartId: ObjectId, shippingAddress?: any): Promise<IOrder> {
        // Check if order already exists for this cart
        const existingOrder = await this.findByCartId(cartId);
        if (existingOrder) {
            throw new Error('Order already exists for this cart');
        }

        const orderData: CreateOrderDto = {
            cartId,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            shippingAddress
        };

        return await this.create(orderData);
    }

    async createCheckoutSession(userId: ObjectId): Promise<any> {
        const cart = await this.cartsService.getByUserId(userId);
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        if (cart._order?.sessionUrl) return cart._order.sessionUrl;

        const order = cart._order ? cart._order : await this.createOrderFromCart(cart._id);
        const items = this.cartItemsToStripeItems(cart.items);
        const metadata = { orderId: order._id.toString() };
        const session = await this.stripeService.createCheckoutSession(items, metadata);

        await this.updateDocument(order._id, { sessionId: session.id, sessionUrl: session.url });
        return session.url;
    }

    cartItemsToStripeItems(cartItems: ICartItem[]): IStripeItem[] {
        const stripeItems = cartItems.map(item => {
            const product = item._product;
            let name = '';
            let description = '';
            let price = 0;

            if (!product) {
                name = 'Unknown Product';
                description = '';
                price = 0;
            } else if (item.variantId) {
                const variant = product.variants.find(v => v._id.toString() === item.variantId?.toString());
                name = product.name;
                description = product.description;
                price = variant?.price ?? product.price;
            } else {
                name = product.name;
                description = product.description;
                price = product.price;
            }

            return {
                name,
                description,
                price,
                quantity: item.quantity,
            };
        });

        return stripeItems;
    }
}
