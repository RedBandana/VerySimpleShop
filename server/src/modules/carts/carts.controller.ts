import { 
    Body, 
    Controller, 
    Logger, 
    Post, 
    Put, 
    Get, 
    Delete, 
    Param, 
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus,
    Request
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { StripeService } from 'src/services/stripe/stripe.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetCartsDto } from './dto/get-carts.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Controller('carts')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(
    new ValidationPipe({
        whitelist: true,
        transform: true,
    }),
)
export class CartsController {
    private readonly logger = new Logger(CartsController.name);

    constructor(
        private readonly cartsService: CartsService,
        private readonly stripeService: StripeService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async create(@Body() createCartDto: CreateCartDto) {
        return await this.cartsService.createDocument(createCartDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async getAll(@Query() getCartsDto: GetCartsDto) {
        return await this.cartsService.getAll(getCartsDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async get(@Param('id') id: string) {
        return await this.cartsService.get(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateCartDto: any) {
        return await this.cartsService.updateDocument(id, updateCartDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string) {
        await this.cartsService.delete(id);
    }

    @Get('user/me')
    @UseGuards(JwtAuthGuard)
    async getMyCart(@Request() req) {
        const userId = req.user.id;
        const cart = await this.cartsService.findByUserId(userId);
        return cart;
    }

    @Post('add')
    @UseGuards(JwtAuthGuard)
    async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
        const userId = req.user.id;
        return await this.cartsService.addToCart(userId, addToCartDto);
    }

    @Post('remove')
    @UseGuards(JwtAuthGuard)
    async removeFromCart(@Request() req, @Body() removeFromCartDto: RemoveFromCartDto) {
        const userId = req.user.id;
        return await this.cartsService.removeFromCart(userId, removeFromCartDto);
    }

    @Put('update')
    @UseGuards(JwtAuthGuard)
    async updateCartItem(@Request() req, @Body() updateCartDto: UpdateCartDto) {
        const userId = req.user.id;
        return await this.cartsService.updateCartItem(userId, updateCartDto);
    }

    @Delete('clear')
    @UseGuards(JwtAuthGuard)
    async clearCart(@Request() req) {
        const userId = req.user.id;
        return await this.cartsService.clearCart(userId);
    }

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    async createCheckoutSession(@Request() req) {
        const userId = req.user.id;
        const cart = await this.cartsService.findByUserId(userId);
        
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // For now, we'll use empty items array as we need ProductsService to get actual product details
        const items: any = [];
        const session = await this.stripeService.createCheckoutSession(items);
        return { url: session.url };
    }
}
