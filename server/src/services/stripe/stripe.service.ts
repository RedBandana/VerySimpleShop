import 'dotenv/config';
import { Injectable, Logger, RawBodyRequest } from '@nestjs/common';
import Stripe from 'stripe';
import { Response } from 'express';
import { StripeItem } from 'src/common/interfaces/stripe-item.interface';

@Injectable()
export class StripeService {
    private readonly logger = new Logger(StripeService.name);

    private readonly WEBHOOK_KEY: string = process.env.STRIPE_WEBHOOK_KEY ?? "";
    private readonly BASE_URL: string = process.env.FRONTEND_URL ?? "";
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_API_KEY ?? "", {
            apiVersion: "2025-05-28.basil"
        });
    }

    async createCheckoutSession(items: StripeItem[], metadata?: Stripe.MetadataParam) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.description,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${this.BASE_URL}/success?orderid=${metadata?.orderId}`,
            cancel_url: `${this.BASE_URL}/cancel?orderid=${metadata?.orderId}`,
            metadata
        });

        return session;
    }

    async retrieveCheckoutSession(sessionId: string) {
        const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
            sessionId,
            { expand: ['line_items'] }
        );

        return sessionWithLineItems;
    }

    async handleWebhook(req: RawBodyRequest<Request>, res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(req.rawBody ?? "", sig, this.WEBHOOK_KEY);
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        switch (event.type) {
            case 'checkout.session.completed':
                {
                    const session = event.data.object;
                    await this.handleSuccessfulCheckout(session);
                    break;
                }
            case 'payment_intent.succeeded':
                {
                    const paymentIntent = event.data.object;
                    await this.handleSuccessfulPayment(paymentIntent);
                    break;
                }
            default:
                this.logger.warn(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }

    private async handleSuccessfulCheckout(session: Stripe.Checkout.Session) {
        this.logger.log('Successful checkout:', session.id);
        // Create an order
    }

    private async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
        this.logger.log('Successful payment:', paymentIntent.id);
        // Create an order
    }
}
