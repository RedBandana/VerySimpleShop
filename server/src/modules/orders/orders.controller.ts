import {
    Controller,
    Logger,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { ObjectId } from 'mongodb';
import { CartOwnerGuard } from 'src/common/guards/cart-owner.guard';
import { OrderOwnerGuard } from 'src/common/guards/order-owner.guard';
import { ResponseUtils } from 'src/common/utils/response.utils';
import { ApiResponse, PaginatedApiResponse } from 'src/common/interfaces/api-response.interface';
import { GetOrderByAuthDto } from './dto/get-order-by-auth.dto';

@Controller('orders')
@UsePipes(
    new ValidationPipe({
        whitelist: true,
        transform: true,
    }),
)
export class OrdersController {
    private readonly logger = new Logger(OrdersController.name);

    constructor(
        private readonly ordersService: OrdersService,

    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async create(@Body() createOrderDto: CreateOrderDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.createDocument(createOrderDto);
        return ResponseUtils.success(order, 'Order created successfully', HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getAll(@Query() getOrdersDto: GetOrdersDto): Promise<PaginatedApiResponse<any> | ApiResponse<any>> {
        const result = await this.ordersService.getAll(getOrdersDto);

        if (result.page && result.limit && result.total) {
            return ResponseUtils.paginated(
                result.orders,
                result.page,
                result.limit,
                result.total,
                'Orders retrieved successfully'
            );
        }

        return ResponseUtils.success(result.orders, 'Orders retrieved successfully');
    }

    @Get(':orderId')
    @UseGuards(JwtAuthGuard, OrderOwnerGuard)
    async get(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.get(orderId);
        return ResponseUtils.success(order, 'Order retrieved successfully');
    }

    @Get('number/:orderNumber')
    @UseGuards(JwtAuthGuard, OrderOwnerGuard)
    async getByNumber(@Param('orderNumber') orderNumber: string): Promise<ApiResponse<any>> {
        const order = await this.ordersService.getByNumber(orderNumber);
        return ResponseUtils.success(order, 'Order retrieved successfully');
    }

    @Post('auth')
    async getByAuth(@Body() getOrderByAuthDto: GetOrderByAuthDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.getByAuth(getOrderByAuthDto.orderNumber, getOrderByAuthDto.postalCode);
        return ResponseUtils.success(order, 'Order retrieved successfully');
    }

    @Put(':orderId')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async update(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updateOrderDto: UpdateOrderDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.updateDocument(orderId, updateOrderDto);
        return ResponseUtils.success(order, 'Order updated successfully');
    }

    @Delete(':orderId')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async delete(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId): Promise<ApiResponse<null>> {
        await this.ordersService.delete(orderId);
        return ResponseUtils.success(null, 'Order deleted successfully', HttpStatus.NO_CONTENT);
    }

    @Put(':orderId/status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updateOrderStatus(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
        return ResponseUtils.success(order, 'Order status updated successfully');
    }

    @Put(':orderId/payment-status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updatePaymentStatus(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.updatePaymentStatus(orderId, updatePaymentStatusDto);
        return ResponseUtils.success(order, 'Payment status updated successfully');
    }

    @Post(':orderId/cancel')
    @UseGuards(JwtAuthGuard, OrderOwnerGuard)
    async cancelOrder(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.cancelOrder(orderId);
        return ResponseUtils.success(order, 'Order cancelled successfully');
    }

    @Post(':orderId/complete')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async completeOrder(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.completeOrder(orderId);
        return ResponseUtils.success(order, 'Order completed successfully');
    }

    @Post('from-cart/:cartId')
    @UseGuards(JwtAuthGuard, CartOwnerGuard)
    async createOrderFromCart(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.createOrderFromCart(cartId);
        return ResponseUtils.success(order, 'Order created from cart successfully');
    }

    @Get('cart/:cartId')
    @UseGuards(JwtAuthGuard, CartOwnerGuard)
    async getOrderByCartId(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.findByCartId(cartId);
        return ResponseUtils.success(order, 'Order retrieved successfully');
    }

    @Post('users/me/checkout')
    @UseGuards(JwtAuthGuard)
    async createCheckoutSession(@Req() req: any): Promise<ApiResponse<any>> {
        const userId = req.user._id;
        const order = await this.ordersService.createCheckoutSession(userId);
        return ResponseUtils.success(order, 'Checkout session created successfully');
    }
}
