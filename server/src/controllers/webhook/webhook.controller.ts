import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { StripeService } from 'src/services/stripe/stripe.service';
import { Response } from 'express';
import { OrdersService } from 'src/modules/orders/orders.service';
import { ObjectId } from 'mongodb';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@Controller('webhook')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(
        private stripeService: StripeService,
        private orderService: OrdersService
    ) { }

    @Post("stripe")
    async handleWebhook(@Req() req: any, @Res() res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        let event;

        try {
            event = this.stripeService.getEvent(req.rawBody ?? "", sig);
            this.logger.log(event.type);
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                await this.orderService.updatePaymentStatus(
                    new ObjectId(paymentIntent.metadata.orderId as string),
                    { paymentStatus: PaymentStatus.PAID }
                );

                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                await this.orderService.updatePaymentStatus(
                    new ObjectId(paymentIntent.metadata.orderId as string),
                    { paymentStatus: PaymentStatus.FAILED }
                );

                break;
            }
            case 'payment_intent.processing': {
                const paymentIntent = event.data.object;
                await this.orderService.updatePaymentStatus(
                    new ObjectId(paymentIntent.metadata.orderId as string),
                    { paymentStatus: PaymentStatus.PROCESSING }
                );

                break;
            }
            case 'payment_intent.canceled': {
                const paymentIntent = event.data.object;
                await this.orderService.updatePaymentStatus(
                    new ObjectId(paymentIntent.metadata.orderId as string),
                    { paymentStatus: PaymentStatus.CANCELLED }
                );

                break;
            }
            case 'checkout.session.completed': {
                const session = event.data.object;
                await this.orderService.updateOrderStatus(
                    new ObjectId(session.metadata.orderId as string),
                    { status: OrderStatus.PROCESSING }
                );

                break;
            }
            case 'checkout.session.async_payment_succeeded': {
                const session = event.data.object;
                await this.orderService.updatePaymentStatus(
                    new ObjectId(session.metadata.orderId as string),
                    { paymentStatus: PaymentStatus.PAID }
                );

                break;
            }
            case 'checkout.session.async_payment_failed': {
                const session = event.data.object;
                await this.orderService.updatePaymentStatus(
                    new ObjectId(session.metadata.orderId as string),
                    { paymentStatus: PaymentStatus.FAILED }
                );

                break;
            }
            case 'checkout.session.expired': {
                const session = event.data.object;
                await this.orderService.updateOrderStatus(
                    new ObjectId(session.metadata.orderId as string),
                    { status: OrderStatus.EXPIRED }
                );

                break;
            }
            default:
                this.logger.warn(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }
}
