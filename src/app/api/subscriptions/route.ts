import { db } from "@/database/drizzle";
import { deliverySchedules, subscriptionPlans, subscriptions, users } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { createSubscriptionSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new Response("Unauthorized", {status: 401})
        }

        const body = await request.json();
        const { planId, paymentMethodId, deliverySchedule } = createSubscriptionSchema.parse(body);

        let customer;
        const existingCustomers = await stripe.customers.list({
            email: session.user.email!,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: session.user.email!,
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
        }

        const plan = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId)).limit(1);
        if (!plan.length) {
            return new Response("Plan not found", { status: 404 });
        }

        const user = await db.select().from(users).where(eq(users.id, session.user.id));

        // Create a new Stripe customer if the user doesn't have one already
        if(!user[0]?.stripeCustomerId){
            const customer = await stripe.customers.create({
                email: user[0].email,
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            })

            await db.update(users).set({
                stripeCustomerId: customer.id,
            }).where(eq(users.id, session.user.id));

            user[0].stripeCustomerId = customer.id;
        } else {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: user[0].stripeCustomerId!,
            });

            await stripe.customers.update(user[0].stripeCustomerId!, {
                // payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
        }

        // Create Stripe subscription
        let stripeSubscription;
        try {
            stripeSubscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: plan[0].stripePriceId }],
                payment_behavior: "default_incomplete",
                payment_settings: {
                    save_default_payment_method: "on_subscription",
                },
                expand: ["latest_invoice.payment_intent"],
            });
        } catch (error) {
            console.error("Error creating Stripe subscription:", error);
            return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
        }

        // Validate Stripe subscription response
        if (!stripeSubscription.latest_invoice || 
            typeof stripeSubscription.latest_invoice === 'string' ||
            !('payment_intent' in stripeSubscription.latest_invoice)) {
            return NextResponse.json({ error: "Invalid subscription response from Stripe" }, { status: 500 });
        }

        // Create subscription and delivery schedule in database
        try {
            const subscriptionResult = await db.insert(subscriptions).values({
                userId: session?.user.id as string,
                planId: planId as string,
                status: "ACTIVE",
                stripeSubscriptionId: stripeSubscription.id,
                stripePriceId: plan[0].stripePriceId,
                stripeCustomerId: user[0].stripeCustomerId as string,
                currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                cancelAtPeriodEnd: false,
            }).returning();

            if (!subscriptionResult.length) {
                throw new Error("Failed to create subscription in database");
            }

            const subscription = subscriptionResult[0];

            await db.insert(deliverySchedules).values({
                subscriptionId: subscription.id,
                preferredDay: deliverySchedule.preferredDay,
                preferredTime: deliverySchedule.preferredTime,
                address: deliverySchedule.address,
                instructions: deliverySchedule.instructions,
            });

            return NextResponse.json({
                message: "Subscription created successfully",
                subscription: subscription,
                clientSecret: (stripeSubscription.latest_invoice.payment_intent as Stripe.PaymentIntent).client_secret
            }, { status: 201 });

        } catch (error) {
            console.error("Error saving to database:", error);
            // TODO: Should cancel the Stripe subscription here since database operations failed
            return NextResponse.json({ error: "Failed to save subscription details" }, { status: 500 });
        }

    } catch (error) {
        console.error("Error creating subscription:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }
}