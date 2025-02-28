import { db } from "@/database/drizzle";
import { deliverySchedules, subscriptionPlans, subscriptions, users } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { createSubscriptionSchema } from "@/lib/validations";
import { desc, eq } from "drizzle-orm";
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


        // Get user and their stripe customer ID
        const user = await db.select().from(users).where(eq(users.id, session.user.id));
        let stripeCustomerId = user[0]?.stripeCustomerId;

        // let customer;
        // const existingCustomers = await stripe.customers.list({
        //     email: session.user.email!,
        //     limit: 1,
        // });
        

        // Create a new Stripe customer if the user doesn't have one already
        if(!stripeCustomerId){
            const customer = await stripe.customers.create({
                email: user[0].email,
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            })
            stripeCustomerId = customer.id;
            
            // Update user with new stripe customer ID
            await db.update(users).set({
                stripeCustomerId: customer.id,
            }).where(eq(users.id, session.user.id));

        } else {
            // If customer exists, create a new payment method attachment
            try {
                // Create a new payment method attachment
                await stripe.paymentMethods.attach(paymentMethodId, {
                    customer: stripeCustomerId,
                });
                
                // Set it as the default payment method
                await stripe.customers.update(stripeCustomerId, {
                    invoice_settings: {
                        default_payment_method: paymentMethodId,
                    },
                });
            } catch (error: any) {
                if (error.code === 'resource_already_exists') {
                    // If payment method is already attached, just update the default payment method
                    await stripe.customers.update(stripeCustomerId, {
                        invoice_settings: {
                            default_payment_method: paymentMethodId,
                        },
                    });
                } else {
                    throw error;
                }
            }
        }

        const plan = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId)).limit(1);
        if (!plan.length) {
            return new Response("Plan not found", { status: 404 });
        }

        // Create Stripe subscription
        let stripeSubscription;
        try {
            stripeSubscription = await stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [{ price: plan[0].stripePriceId }],
                payment_behavior: "default_incomplete",
                payment_settings: {
                    payment_method_types: ['card'],
                    save_default_payment_method: "on_subscription",
                },
                metadata: {
                    userId: session.user.id,
                    planId: planId,
                    type: 'subscription'
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
                stripeCustomerId: stripeCustomerId,
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

export async function GET() {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      // Fetch all subscriptions for the user with related plan and delivery schedule info
      const userSubscriptions = await db
        .select({
          subscription: subscriptions,
          plan: subscriptionPlans,
          deliverySchedule: deliverySchedules,
        })
        .from(subscriptions)
        .where(eq(subscriptions.userId, session.user.id))
        .leftJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.id))
        .leftJoin(deliverySchedules, eq(subscriptions.id, deliverySchedules.subscriptionId))
        .orderBy(desc(subscriptions.createdAt));
  
      // Transform the data to match the frontend interface
      const formattedSubscriptions = userSubscriptions.map(({ subscription, plan, deliverySchedule }) => ({
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        currentPeriodStart: subscription.currentPeriodStart,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        plan: {
          name: plan?.name,
          price: plan?.price,
          interval: plan?.interval,
          maxProducts: plan?.maxProducts,
        },
        deliverySchedule: {
          preferredDay: deliverySchedule?.preferredDay,
          preferredTime: deliverySchedule?.preferredTime,
          address: deliverySchedule?.address,
          instructions: deliverySchedule?.instructions,
        },
      }));
  
      return NextResponse.json(formattedSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }
  }