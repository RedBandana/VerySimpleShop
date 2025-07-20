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
import { MailService } from '../mail/mail.service';
import { LocalizationService } from 'src/services/localization/localization.service';
import { WEBSITE_URL } from 'src/common/constants/general.constant';

@Injectable()
export class OrdersService extends DatabaseCollectionService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        @InjectModel(DatabaseModel.ORDER) protected readonly orderModel: Model<IOrder>,
        protected readonly cartsService: CartsService,
        private readonly stripeService: StripeService,
        private readonly mailService: MailService,
        private readonly localizationService: LocalizationService,
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

    async getByNumber(orderNumber: string): Promise<IOrder> {
        const order = await this.filterOneBy({ number: orderNumber });
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

    async createOrderFromCart(cartId: ObjectId): Promise<IOrder> {
        const existingOrder = await this.findByCartId(cartId);
        if (existingOrder) {
            throw new Error('Order already exists for this cart');
        }

        const orderData: CreateOrderDto = {
            cartId,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
        };

        return await this.create(orderData);
    }

    async createCheckoutSession(userId: ObjectId): Promise<IOrder> {
        const cart = await this.cartsService.getByUserId(userId);
        if (!cart || cart.items.length === 0)
            throw new Error('Cart is empty');

        const oldCartOrder = cart._order;
        const order = oldCartOrder ? oldCartOrder : await this.createOrderFromCart(cart._id);

        const items = this.cartItemsToStripeItems(cart.items);
        const metadata = { orderId: order._id.toString(), orderNumber: order.number };
        const session = await this.stripeService.createCheckoutSession(items, metadata);
        const updatedOrder = await this.updateDocument(order._id, { sessionId: session.id, sessionUrl: session.url });

        if (oldCartOrder?.sessionId)
            await this.stripeService.expireCheckoutSession(oldCartOrder.sessionId);

        return updatedOrder;
    }

    async sendOrderCompletedEmail(order: IOrder) {
        if (!order.shippingDetails)
            throw new Error('Cannot send email, no shipping details or cart items');

        const lang = this.localizationService.lang;
        const subject = this.localizationService.translate('emails.orderCompleted.subject', { lang });
        const mail = {
            to: order.shippingDetails.email,
            subject,
            template: 'order-completed',
            context: {
                lang,
                websiteUrl: WEBSITE_URL,
                name: order.shippingDetails.name,
                city: order.shippingDetails.address.city,
                state: order.shippingDetails.address.state,
                orderNumber: order.number,
                total: this.localizationService.formatCurrency(order._cart?.totalPrice ?? 0),
                cartItems: order._cart?.items
            },
        };

        await this.mailService.sendMail(mail);
    }

    cartItemsToStripeItems(cartItems: ICartItem[]): IStripeItem[] {
        const stripeItems = cartItems.map(item => {
            const product = item._product;
            let name = '';
            let description = '';
            let price = 0;
            let imageUrl = '';

            if (!product) {
                name = 'Unknown Product';
            } else if (item.variantId) {
                const variant = product.variants.find(v => v._id.toString() === item.variantId?.toString());
                description = product.description;
                price = variant?.price ?? product.price;

                if (variant?.name) name = `${product.name} ${variant.name}`;
                else name = product.name;

                if (variant?.imageUrls && variant.imageUrls.length > 0) imageUrl = variant.imageUrls[0];
                else imageUrl = product.imageUrls[0]
            } else {
                name = product.name;
                description = product.description;
                price = product.price;
                imageUrl = product.imageUrls[0]
            }

            const stripeItem: IStripeItem = {
                name,
                description,
                price,
                imageUrl,
                quantity: item.quantity
            };

            return stripeItem;
        });

        return stripeItems;
    }
}
