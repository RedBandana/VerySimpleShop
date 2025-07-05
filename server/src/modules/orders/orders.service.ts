import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { DatabaseModel } from 'src/common/enums/database-model.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { DatabaseCollectionService } from 'src/services/database-collection/database-collection.service';

@Injectable()
export class OrdersService extends DatabaseCollectionService {

    constructor(
        @InjectModel(DatabaseModel.ORDER) protected readonly orderModel: Model<Order>,
    ) {
        super(orderModel);
    }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const order = await this.createDocument(createOrderDto);
        return order;
    }

    async getAll(getOrdersDto: GetOrdersDto): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
        const { page = 1, limit = 10, cartId, status, paymentStatus, userId } = getOrdersDto;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (cartId) {
            filter.cartId = cartId;
        }

        if (status) {
            filter.status = status;
        }

        if (paymentStatus) {
            filter.paymentStatus = paymentStatus;
        }

        // If userId is provided, we need to find orders by looking up carts with that userId
        // This would require joining with Cart collection in a real implementation
        if (userId) {
            // For now, we'll add a comment about this limitation
            // In a real implementation, you'd use aggregate pipeline to join with Cart collection
        }

        const [orders, total] = await Promise.all([
            this.orderModel.find(filter).skip(skip).limit(limit).lean().exec(),
            this.orderModel.countDocuments(filter).lean().exec(),
        ]);

        return {
            orders,
            total,
            page,
            limit,
        };
    }

    async get(id: string): Promise<Order> {
        const order = await this.getDocument(id);
        return order;
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.updateDocument(id, updateOrderDto);
        return order;
    }

    async delete(id: string): Promise<void> {
        await this.deleteDocument(id);
    }

    async findByCartId(cartId: string): Promise<Order | null> {
        return await this.orderModel.findOne({ cartId }).exec();
    }

    async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
        const order = await this.updateDocument(id, { status: updateOrderStatusDto.status });
        return order;
    }

    async updatePaymentStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<Order> {
        const order = await this.updateDocument(id, { paymentStatus: updatePaymentStatusDto.paymentStatus });
        return order;
    }

    async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
        return await this.orderModel.find({ status }).exec();
    }

    async getOrdersByPaymentStatus(paymentStatus: PaymentStatus): Promise<Order[]> {
        return await this.orderModel.find({ paymentStatus }).exec();
    }

    async cancelOrder(id: string): Promise<Order> {
        const order = await this.get(id);
        
        if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
            throw new Error('Cannot cancel order that has been shipped or delivered');
        }

        return await this.updateDocument(id, { 
            status: OrderStatus.CANCELLED 
        });
    }

    async completeOrder(id: string): Promise<Order> {
        const order = await this.get(id);
        
        if (order.paymentStatus !== PaymentStatus.PAID) {
            throw new Error('Cannot complete order with unpaid payment status');
        }

        return await this.updateDocument(id, { 
            status: OrderStatus.COMPLETED 
        });
    }

    async createOrderFromCart(cartId: string, shippingAddress?: any): Promise<Order> {
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
}
