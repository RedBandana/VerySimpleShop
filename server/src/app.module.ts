import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeService } from './services/stripe/stripe.service';
import { CheckoutController } from './controllers/checkout/checkout.controller';
import { WebhookController } from './controllers/webhook/webhook.controller';

@Module({
  imports: [],
  controllers: [AppController, CheckoutController, WebhookController],
  providers: [AppService, StripeService],
})
export class AppModule {}
