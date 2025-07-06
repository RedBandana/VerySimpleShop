import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeItem } from 'src/common/interfaces/stripe-item.interface';

@Injectable()
export class StripeService {
    private readonly logger = new Logger(StripeService.name);

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
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'],
            },
            mode: 'payment',
            payment_intent_data: {
                metadata: {
                    checkout_session_id: '{CHECKOUT_SESSION_ID}',
                    ...metadata
                }
            },
            success_url: `${this.BASE_URL}/success`,
            cancel_url: `${this.BASE_URL}/cancel`,
            metadata
        });

        return session;
    }

    async retrieveCheckoutSession(sessionId: string) {
        const session = await this.stripe.checkout.sessions.retrieve(
            sessionId, { expand: ['line_items', 'shipping_details'] }
        );

        return session;
    }

    async getSessionIdFromPaymentIntent(paymentIntentId: string) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        const sessionId = paymentIntent.metadata.checkout_session_id;
        const session = await this.retrieveCheckoutSession(sessionId);

        return session;
    }

    async updateSessionMetadata(sessionId: string, metadata: Stripe.Metadata) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_intent) {
            const paymentIntentId = typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent.id;

            await this.stripe.paymentIntents.update(paymentIntentId, { metadata });
        }
    }

    async updateSubscriptionMetadata(sessionId: string, metadata: Stripe.Metadata) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);

        if (session.subscription) {
            const subscriptionId = typeof session.subscription === 'string'
                ? session.subscription
                : session.subscription.id;

            await this.stripe.subscriptions.update(subscriptionId, { metadata });
        }
    }

    getEvent(payload: any, signature: string): Stripe.Event {
        return this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_KEY ?? "");
    }
}
