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

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async get(@Param('id') id: string) {
        return await this.ordersService.get(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return await this.ordersService.updateDocument(id, updateOrderDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string) {
        await this.ordersService.delete(id);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return await this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
    }

    @Put(':id/payment-status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updatePaymentStatus(@Param('id') id: string, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto) {
        return await this.ordersService.updatePaymentStatus(id, updatePaymentStatusDto);
    }

    @Post(':id/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelOrder(@Param('id') id: string) {
        return await this.ordersService.cancelOrder(id);
    }

    @Post(':id/complete')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async completeOrder(@Param('id') id: string) {
        return await this.ordersService.completeOrder(id);
    }

    @Post('from-cart/:cartId')
    @UseGuards(JwtAuthGuard)
    async createOrderFromCart(@Param('cartId') cartId: string, @Body() shippingAddress?: any) {
        return await this.ordersService.createOrderFromCart(cartId, shippingAddress?.shippingAddress);
    }

    @Get('cart/:cartId')
    @UseGuards(JwtAuthGuard)
    async getOrderByCartId(@Param('cartId') cartId: string) {
        return await this.ordersService.findByCartId(cartId);
    }
}
