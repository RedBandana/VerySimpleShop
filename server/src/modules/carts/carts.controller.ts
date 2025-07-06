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
    Req
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetCartsDto } from './dto/get-carts.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { CartOwnerGuard } from 'src/common/guards/cart-owner.guard';
import { ObjectId } from 'mongodb';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';

@Controller('carts')
@UseGuards(JwtAuthGuard)
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
    ) { }

    @Post()
    @UseGuards(AdminGuard)
    async create(@Body() createCartDto: CreateCartDto) {
        return await this.cartsService.createDocument(createCartDto);
    }

    @Get()
    @UseGuards(AdminGuard)
    async getAll(@Query() getCartsDto: GetCartsDto) {
        return await this.cartsService.getAll(getCartsDto);
    }

    @Get(':cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async get(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId) {
        return await this.cartsService.get(cartId);
    }

    @Put(':cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async update(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId, @Body() updateCartDto: any) {
        return await this.cartsService.updateDocument(cartId, updateCartDto);
    }

    @Delete(':cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId) {
        await this.cartsService.delete(cartId);
    }

    @Get('users/me')
    async getMyCart(@Req() req: any) {
        const userId = req.user._id;
        const cart = await this.cartsService.getByUserId(userId);
        return cart;
    }

    @Post('users/me/add')
    async addToCart(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
        const userId = req.user._id;
        return await this.cartsService.addToCart(userId, addToCartDto);
    }

    @Post('users/me/remove')
    async removeFromCart(@Req() req: any, @Body() removeFromCartDto: RemoveFromCartDto) {
        const userId = req.user._id;
        return await this.cartsService.removeFromCart(userId, removeFromCartDto);
    }

    @Put('users/me/update')
    async updateCartItem(@Req() req: any, @Body() updateCartDto: UpdateCartDto) {
        const userId = req.user._id;
        return await this.cartsService.updateCartItem(userId, updateCartDto);
    }

    @Delete('users/me/clear')
    async clearCart(@Req() req: any) {
        const userId = req.user._id;
        return await this.cartsService.clearCart(userId);
    }
}
