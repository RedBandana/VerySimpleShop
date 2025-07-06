import {
    Controller,
    Logger,
    UseGuards,
    UseInterceptors,
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
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { ObjectId } from 'mongodb';
import { CartOwnerGuard } from 'src/common/guards/cart-owner.guard';
import { OrderOwnerGuard } from 'src/common/guards/order-owner.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FormatResponseInterceptor)
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
    async create(@Body() createOrderDto: CreateOrderDto) {
        return await this.ordersService.createDocument(createOrderDto);
    }

    @Get()
    @UseGuards(AdminGuard)
    async getAll(@Query() getOrdersDto: GetOrdersDto) {
        return await this.ordersService.getAll(getOrdersDto);
    }

    @Get(':orderId')
    @UseGuards(OrderOwnerGuard, AdminGuard)
    async get(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId) {
        return await this.ordersService.get(orderId);
    }

    @Put(':orderId')
    @UseGuards(AdminGuard)
    async update(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updateOrderDto: UpdateOrderDto) {
        return await this.ordersService.updateDocument(orderId, updateOrderDto);
    }

    @Delete(':orderId')
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId) {
        await this.ordersService.delete(orderId);
    }

    @Put(':orderId/status')
    @UseGuards(AdminGuard)
    async updateOrderStatus(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return await this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
    }

    @Put(':orderId/payment-status')
    @UseGuards(AdminGuard)
    async updatePaymentStatus(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto) {
        return await this.ordersService.updatePaymentStatus(orderId, updatePaymentStatusDto);
    }

    @Post(':orderId/cancel')
    @UseGuards(OrderOwnerGuard, AdminGuard)
    async cancelOrder(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId) {
        return await this.ordersService.cancelOrder(orderId);
    }

    @Post(':orderId/complete')
    @UseGuards(AdminGuard)
    async completeOrder(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId) {
        return await this.ordersService.completeOrder(orderId);
    }

    @Post('from-cart/:cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async createOrderFromCart(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId, @Body() shippingAddress?: any) {
        return await this.ordersService.createOrderFromCart(cartId, shippingAddress?.shippingAddress);
    }

    @Get('cart/:cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async getOrderByCartId(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId) {
        return await this.ordersService.findByCartId(cartId);
    }

    @Post('users/me/checkout')
    async createCheckoutSession(@Req() req: any) {
        const userId = req.user._id;
        const sessionUrl = await this.ordersService.createCheckoutSession(userId);
        return { url: sessionUrl, statusCode: 302 };
    }
}
