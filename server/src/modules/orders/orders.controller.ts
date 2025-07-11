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
    HttpCode,
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
import { ResponseUtil } from 'src/common/utils/response.util';
import { ApiResponse, PaginatedApiResponse } from 'src/common/interfaces/api-response.interface';

@Controller('orders')
@UseGuards(JwtAuthGuard)
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
    @UseGuards(AdminGuard)
    async create(@Body() createOrderDto: CreateOrderDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.createDocument(createOrderDto);
        return ResponseUtil.success(order, 'Order created successfully', HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AdminGuard)
    async getAll(@Query() getOrdersDto: GetOrdersDto): Promise<PaginatedApiResponse<any> | ApiResponse<any>> {
        const result = await this.ordersService.getAll(getOrdersDto);
        
        if (result.page && result.limit && result.total) {
            return ResponseUtil.paginated(
                result.orders,
                result.page,
                result.limit,
                result.total,
                'Orders retrieved successfully'
            );
        }
        
        return ResponseUtil.success(result.orders, 'Orders retrieved successfully');
    }

    @Get(':orderId')
    @UseGuards(OrderOwnerGuard, AdminGuard)
    async get(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.get(orderId);
        return ResponseUtil.success(order, 'Order retrieved successfully');
    }

    @Put(':orderId')
    @UseGuards(AdminGuard)
    async update(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updateOrderDto: UpdateOrderDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.updateDocument(orderId, updateOrderDto);
        return ResponseUtil.success(order, 'Order updated successfully');
    }

    @Delete(':orderId')
    @UseGuards(AdminGuard)
    async delete(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId): Promise<ApiResponse<null>> {
        await this.ordersService.delete(orderId);
        return ResponseUtil.success(null, 'Order deleted successfully', HttpStatus.NO_CONTENT);
    }

    @Put(':orderId/status')
    @UseGuards(AdminGuard)
    async updateOrderStatus(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
        return ResponseUtil.success(order, 'Order status updated successfully');
    }

    @Put(':orderId/payment-status')
    @UseGuards(AdminGuard)
    async updatePaymentStatus(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<ApiResponse<any>> {
        const order = await this.ordersService.updatePaymentStatus(orderId, updatePaymentStatusDto);
        return ResponseUtil.success(order, 'Payment status updated successfully');
    }

    @Post(':orderId/cancel')
    @UseGuards(OrderOwnerGuard, AdminGuard)
    async cancelOrder(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.cancelOrder(orderId);
        return ResponseUtil.success(order, 'Order cancelled successfully');
    }

    @Post(':orderId/complete')
    @UseGuards(AdminGuard)
    async completeOrder(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.completeOrder(orderId);
        return ResponseUtil.success(order, 'Order completed successfully');
    }

    @Post('from-cart/:cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async createOrderFromCart(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId, @Body() shippingAddress?: any): Promise<ApiResponse<any>> {
        const order = await this.ordersService.createOrderFromCart(cartId, shippingAddress?.shippingAddress);
        return ResponseUtil.success(order, 'Order created from cart successfully');
    }

    @Get('cart/:cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async getOrderByCartId(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId): Promise<ApiResponse<any>> {
        const order = await this.ordersService.findByCartId(cartId);
        return ResponseUtil.success(order, 'Order retrieved successfully');
    }

    @Post('users/me/checkout')
    async createCheckoutSession(@Req() req: any): Promise<ApiResponse<any>> {
        const userId = req.user._id;
        const sessionUrl = await this.ordersService.createCheckoutSession(userId);
        return ResponseUtil.success({ url: sessionUrl }, 'Checkout session created successfully');
    }
}
