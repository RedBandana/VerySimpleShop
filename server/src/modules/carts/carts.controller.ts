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
    UsePipes,
    ValidationPipe,
    HttpStatus,
    Req
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateCartDto } from './dto/create-cart.dto';
import { GetCartsDto } from './dto/get-carts.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { CartOwnerGuard } from 'src/common/guards/cart-owner.guard';
import { ObjectId } from 'mongodb';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { ResponseUtil } from 'src/common/utils/response.util';
import { ApiResponse, PaginatedApiResponse } from 'src/common/interfaces/api-response.interface';

@Controller('carts')
@UseGuards(JwtAuthGuard)
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
    async create(@Body() createCartDto: CreateCartDto): Promise<ApiResponse<any>> {
        const cart = await this.cartsService.createDocument(createCartDto);
        return ResponseUtil.success(cart, 'Cart created successfully', HttpStatus.CREATED);
    }

    @Get()
    @UseGuards(AdminGuard)
    async getAll(@Query() getCartsDto: GetCartsDto): Promise<PaginatedApiResponse<any> | ApiResponse<any>> {
        const result = await this.cartsService.getAll(getCartsDto);
        
        if (result.page && result.limit && result.total) {
            return ResponseUtil.paginated(
                result.carts,
                result.page,
                result.limit,
                result.total,
                'Carts retrieved successfully'
            );
        }
        
        return ResponseUtil.success(result.carts, 'Carts retrieved successfully');
    }

    @Get(':cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async get(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId): Promise<ApiResponse<any>> {
        const cart = await this.cartsService.get(cartId);
        return ResponseUtil.success(cart, 'Cart retrieved successfully');
    }

    @Put(':cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async update(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId, @Body() updateCartDto: any): Promise<ApiResponse<any>> {
        const cart = await this.cartsService.updateDocument(cartId, updateCartDto);
        return ResponseUtil.success(cart, 'Cart updated successfully');
    }

    @Delete(':cartId')
    @UseGuards(CartOwnerGuard, AdminGuard)
    async delete(@Param('cartId', ParseObjectIdPipe) cartId: ObjectId): Promise<ApiResponse<null>> {
        await this.cartsService.delete(cartId);
        return ResponseUtil.success(null, 'Cart deleted successfully', HttpStatus.NO_CONTENT);
    }

    @Get('users/me')
    async getMyCart(@Req() req: any): Promise<ApiResponse<any>> {
        const userId = req.user._id;
        const cart = await this.cartsService.getByUserId(userId);
        return ResponseUtil.success(cart, 'Cart retrieved successfully');
    }

    @Post('users/me/add')
    async addToCart(@Req() req: any, @Body() addToCartDto: AddToCartDto): Promise<ApiResponse<any>> {
        const userId = req.user._id;
        const cart = await this.cartsService.addToCart(userId, addToCartDto);
        return ResponseUtil.success(cart, 'Item added to cart successfully');
    }

    @Post('users/me/remove')
    async removeFromCart(@Req() req: any, @Body() removeFromCartDto: RemoveFromCartDto): Promise<ApiResponse<any>> {
        const userId = req.user._id;
        const cart = await this.cartsService.removeFromCart(userId, removeFromCartDto);
        return ResponseUtil.success(cart, 'Item removed from cart successfully');
    }

    @Put('users/me/update')
    async updateCartItem(@Req() req: any, @Body() updateCartDto: UpdateCartDto): Promise<ApiResponse<any>> {
        const userId = req.user._id;
        const cart = await this.cartsService.updateCartItem(userId, updateCartDto);
        return ResponseUtil.success(cart, 'Cart item updated successfully');
    }

    @Delete('users/me/clear')
    async clearCart(@Req() req: any): Promise<ApiResponse<any>> {
        const userId = req.user._id;
        const cart = await this.cartsService.clearCart(userId);
        return ResponseUtil.success(cart, 'Cart cleared successfully');
    }
}
