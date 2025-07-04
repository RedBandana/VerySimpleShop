import { Body, Controller, Logger, Post, Put } from '@nestjs/common';
import { StripeService } from 'src/services/stripe/stripe.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Controller('carts')
export class CartsController {
    private readonly logger = new Logger(CartsController.name);

    constructor(private stripeService: StripeService) { }

    @Post('add')
    addToCart(@Body() addToCartDto: AddToCartDto) {
        this.logger.log(addToCartDto);
    }

    @Post('remove')
    removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
        this.logger.log(removeFromCartDto);
    }

    @Put('update')
    updateCart(@Body() updateCartDto: UpdateCartDto) {
        this.logger.log(updateCartDto);
    }

    @Post('checkout')
    async createCheckoutSession() {
        const items: any = [];
        const session = await this.stripeService.createCheckoutSession(items);
        return { url: session.url };
    }
}
