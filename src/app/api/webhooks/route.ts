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
        // console.log("Event::", event);
    } catch (error) {
        return new NextResponse(`invalid signature: ${error}`, { status: 400 });
    }

    // const session = event.data.object as Stripe.Checkout.Session;
    // console.log("Session::", session);
    
    // if (event.type === "checkout.session.completed") {
    //     console.log(`Payment was successfull for user!`);
    //     const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    //     // console.log("Subscription :", subscription);
    // }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount_received} was successful!`);

        // to get the purchase type from the metadata
        // const purchaseType = paymentIntent.metadata?.purchaseType;

        // idhar you can update the order status in your database here
        // 1. Create order in your database
        // 2. Send confirmation email
        // 3. Update inventory - quantity ko update kr skte
        // 4. Any other post-payment processing
        try {
            const items = paymentIntent.metadata?.items 
                ? JSON.parse(paymentIntent.metadata.items) 
                : [];

            const response = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items,
                    totalAmount: paymentIntent.amount / 100,
                    shippingAddress: paymentIntent.metadata.shippingAddress || "",
                    paymentIntentId: paymentIntent.id,
                    paymentMethod: paymentIntent.payment_method_types[0],
                    userId: paymentIntent.metadata.userId,
                    isWebhook: true,
                    // purchaseType,
                }),
            })

            if(!response.ok){
                const errorText = await response.text();
                console.log("Error while creating order", errorText)
            }

            const order = await response.json();
            console.log("Order created successfully", order)    

            return NextResponse.json({ success: true, order: order.order });

        } catch (error) {
            console.log("error while createing order:", error)
            return NextResponse.json(
                { error: "Error while creating order" },
                { status: 500 }
            );
        }
    }

    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount_received} has failedddddddd!`);
        // You can update the order status in your database here
        return NextResponse.json({ 
            success: false, 
            error: "Payment failed" 
        });
    }
    

    return NextResponse.json({
        received: true,
    })
}
