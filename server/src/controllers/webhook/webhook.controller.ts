import { Controller, Post, Req, Res } from '@nestjs/common';
import { StripeService } from 'src/services/stripe/stripe.service';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
    constructor(private stripeService: StripeService) { }

    @Post()
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        return this.stripeService.handleWebhook(req, res);
    }
}
