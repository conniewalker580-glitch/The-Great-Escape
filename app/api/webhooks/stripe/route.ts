import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createSubscription, updateSubscriptionStatus, updateUserTier } from "@/lib/database";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const userId = session.metadata?.userId;
                const tier = session.metadata?.tier;

                if (!userId || !tier) {
                    console.error("Missing userId or tier in session metadata");
                    break;
                }

                // Get subscription details
                const subscriptionId = session.subscription as string;
                const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

                // Create subscription in database
                await createSubscription({
                    userId,
                    tier,
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: subscriptionId,
                    stripePriceId: subscription.items.data[0].price.id,
                    currentPeriodStart: new Date((subscription.current_period_start as number) * 1000),
                    currentPeriodEnd: new Date((subscription.current_period_end as number) * 1000)
                });

                console.log(`✅ Subscription created for user ${userId} - Tier: ${tier}`);
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object;

                // Update subscription status
                await updateSubscriptionStatus(
                    subscription.id,
                    subscription.status
                );

                console.log(`✅ Subscription updated: ${subscription.id} - Status: ${subscription.status}`);
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;

                // Mark subscription as canceled
                await updateSubscriptionStatus(subscription.id, "canceled");

                console.log(`✅ Subscription canceled: ${subscription.id}`);
                break;
            }

            case "invoice.payment_succeeded": {
                const invoice = event.data.object as any;
                const subscriptionId = invoice.subscription as string;

                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

                    // Update subscription period
                    await createSubscription({
                        userId: subscription.metadata?.userId || '',
                        tier: subscription.metadata?.tier || 'free',
                        stripeCustomerId: subscription.customer as string,
                        stripeSubscriptionId: subscription.id,
                        stripePriceId: subscription.items.data[0].price.id,
                        currentPeriodStart: new Date(subscription.current_period_start * 1000),
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                    });
                }

                console.log(`✅ Payment succeeded for invoice: ${invoice.id}`);
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as any;
                const subscriptionId = invoice.subscription as string;

                if (subscriptionId) {
                    await updateSubscriptionStatus(subscriptionId, "past_due");
                }

                console.log(`⚠️ Payment failed for invoice: ${invoice.id}`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
