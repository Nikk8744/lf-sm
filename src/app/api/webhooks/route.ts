import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    // get the payload that is coming fromn stripe and store it in text format not json
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
        console.log("Event::", event);
    } catch (error) {
        return new NextResponse("invalid signature", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Session::", session);
    if (event.type === "checkout.session.completed") {
        console.log(`Payment was successfull for user!`);
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        console.log("Subscription :", subscription);
    }
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount_received} was successful!`);
        // You can update the order status in your database here
    }
    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount_received} has failedddddddd!`);
        // You can update the order status in your database here
    }
    

    return new NextResponse("Webhook received", { status: 200 });
}
