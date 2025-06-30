import { Body, Controller, Post } from '@nestjs/common';
import { StripeItem } from 'src/services/stripe/stripe.interface';
import { StripeService } from 'src/services/stripe/stripe.service';

@Controller('checkout')
export class CheckoutController {
    constructor(private stripeService: StripeService) { }

    @Post()
    async createCheckoutSession(@Body() items: StripeItem[]) {
        const session = await this.stripeService.createCheckoutSession(items);
        return { url: session.url };
    }
}
