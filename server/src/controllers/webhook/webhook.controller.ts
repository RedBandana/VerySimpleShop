import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { StripeService } from 'src/services/stripe/stripe.service';
import { Response } from 'express';
import { OrdersService } from 'src/modules/orders/orders.service';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { ObjectId } from 'mongodb';
import { IShippingDetails } from 'src/modules/orders/schemas/shipping-details.schema';

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
            this.logger.log(`Event type: ${event.type} ${JSON.stringify(event.data.object.metadata)}`);
        } catch (err) {
            this.logger.error(`Webhook Error: ${err.message}`);
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
                const orderId = new ObjectId(session.metadata.orderId as string);
                await this.orderService.updateOrderStatus(
                    orderId,
                    { status: OrderStatus.PROCESSING }
                );

                const shippingDetails: IShippingDetails = { ...session.shipping_details };
                shippingDetails.email = session.customer_details.email;
                shippingDetails.trackingNumber = session.shipping_details.tracking_number;
                shippingDetails.address.postalCode = session.shipping_details.address.postal_code;

                const updatedOrder = await this.orderService.update(orderId, { shippingDetails });
                await this.orderService.sendOrderCompletedEmail(updatedOrder)

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
                const order = await this.orderService.get(new ObjectId(session.metadata.orderId as string));

                if (order.sessionId === session.id) {
                    await this.orderService.updateOrderStatus(
                        order._id,
                        { status: OrderStatus.EXPIRED }
                    );
                }

                break;
            }
            default:
                this.logger.warn(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }
}
