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
    Request
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

@Controller('orders')
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
    @UseGuards(JwtAuthGuard, AdminGuard)
    async create(@Body() createOrderDto: CreateOrderDto) {
        return await this.ordersService.createDocument(createOrderDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getAll(@Query() getOrdersDto: GetOrdersDto) {
        return await this.ordersService.getAll(getOrdersDto);
    }

    @Get(':orderId')
    @UseGuards(JwtAuthGuard)
    async get(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId) {
        return await this.ordersService.get(orderId);
    }

    @Put(':orderId')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async update(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updateOrderDto: UpdateOrderDto) {
        return await this.ordersService.updateDocument(orderId, updateOrderDto);
    }

    @Delete(':orderId')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId) {
        await this.ordersService.delete(orderId);
    }

    @Put(':orderId/status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updateOrderStatus(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return await this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
    }

    @Put(':orderId/payment-status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updatePaymentStatus(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto) {
        return await this.ordersService.updatePaymentStatus(orderId, updatePaymentStatusDto);
    }

    @Post(':orderId/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelOrder(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId) {
        return await this.ordersService.cancelOrder(orderId);
    }

    @Post(':orderId/complete')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async completeOrder(@Param('orderId', ParseObjectIdPipe) orderId: ObjectId) {
        return await this.ordersService.completeOrder(orderId);
    }

    @Post('from-cart/:cartId')
    @UseGuards(JwtAuthGuard)
    async createOrderFromCart(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId, @Body() shippingAddress?: any) {
        return await this.ordersService.createOrderFromCart(cartId, shippingAddress?.shippingAddress);
    }

    @Get('cart/:cartId')
    @UseGuards(JwtAuthGuard)
    async getOrderByCartId(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId) {
        return await this.ordersService.findByCartId(cartId);
    }
}
