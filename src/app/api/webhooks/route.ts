import { db } from "@/database/drizzle";
import { orderItems, products, users } from "@/database/schema";
import { validatePaymentIntent } from "@/lib/helpers/payment";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

async function createOrder(paymentIntent: Stripe.PaymentIntent) {
    try {
        // const items = paymentIntent.metadata?.items 
        //     ? JSON.parse(paymentIntent.metadata.items) 
        //     : [];

        validatePaymentIntent(paymentIntent);

        // Parse the simplified items from metadata
        const simplifiedItems = JSON.parse(paymentIntent.metadata.itemsJson || '[]');

        // Fetch and validate all products details from databse
        const completeItems = await Promise.all(
            simplifiedItems.map(async (item: { id: string, qty: number }) => {
                const [product] = await db
                    .select()
                    .from(products)
                    .where(eq(products.id, item.id));

                if (!product) {
                    throw new Error(`Product ${item.id} not found`);
                }

                if ((product.quantity || 0) < item.qty) {
                    throw new Error(`Insufficient inventory for product ${product.name}`);
                }

                return {
                    productId: item.id,
                    quantity: item.qty,
                    price: parseFloat(product.price),
                    // name: product.name,
                    // imageUrl: product.image,
                    // farmLocation: product.farmLocation
                };
            })
        );

        const orderData = {
            items: completeItems,
            totalAmount: paymentIntent.amount / 100,
            shippingAddress: paymentIntent.metadata.shippingAddress,
            paymentIntentId: paymentIntent.id,
            paymentMethod: paymentIntent.payment_method_types[0],
            userId: paymentIntent.metadata.userId,
            isWebhook: true,
        };

        const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            throw new Error(`Failed to create order: ${errorText}`);
        }

        const orderResult = await orderResponse.json();
        return orderResult;
    } catch (error) {
        console.error("Error in createOrder:", error);
        throw error;
    }
}

async function sendConfirmationEmail(paymentIntent: Stripe.PaymentIntent, orderResult: any) {
    try {
        // fetching the user details
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, paymentIntent.metadata.userId));

        if (!user?.email) {
            throw new Error("User email not found");
        }
        const items = await db
            .select({
                id: orderItems.id,
                quantity: orderItems.quantity,
                unitPrice: orderItems.unitPrice,
                totalPrice: orderItems.totalPrice,
                productName: products.name,
                productImage: products.image,
            })
            .from(orderItems)
            .where(eq(orderItems.orderId, orderResult.order.id))
            .leftJoin(products, eq(orderItems.productId, products.id));

        // Format items for email
        const formattedItems = items.map(item => ({
            name: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            totalPrice: item.totalPrice.toString(),
            image: item.productImage,
        }));
        // sending the confirmation email
        await sendOrderConfirmationEmail({
            to: user.email,
            orderNumber: orderResult.order.id,
            customerName: /* user.name ||*/ "Valued Customer",
            // orderItems: orderResult.order.items,
            orderItems: formattedItems.map(item => ({
                name: item.name || 'Unnamed Product',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            })),
            totalAmount: (paymentIntent.amount / 100).toString(),
            shippingAddress: paymentIntent.metadata.shippingAddress || "Not provided",
        });
        console.log("Email sent successfully")
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        throw error;
        // console.error("Full error details:", {
        //     paymentIntent: paymentIntent.id,
        //     orderId: orderResult?.order?.id,
        //     error
        // });
    }
}

export async function POST(req: Request) {
    console.log("Webhook endpoint hittttttt")
    // get the payload that is coming fromn stripe and store it in text format not json
    try {
        const body = await req.text();
        const signature = (await headers()).get("Stripe-Signature") as string;

        if (!signature) {
            return NextResponse.json(
                { error: "Missing Stripe signature" },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET as string
            );
            // console.log("Event::", event);
        } catch (error) {
            console.error("Webhook signature verification failed:", error);
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

            try {

                const orderResult = await createOrder(paymentIntent);
                console.log("Order created successfully", orderResult)

                await sendConfirmationEmail(paymentIntent, orderResult);
                console.log("Comnfirmation Email sent successfully")

                return NextResponse.json({ success: true, order: orderResult.order.id, message: "Order created and email sent successfully" });

            } catch (error) {
                console.error("Error processing payment intent:", error);
                return NextResponse.json(
                    {
                        success: false,
                        error: error,
                        paymentIntentId: paymentIntent.id,
                    },
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
                error: "Payment failed",
                paymentIntentId: paymentIntent.id,
            });
        }


        return NextResponse.json({
            received: true,
        })
    } catch (error) {
        console.error("Webhook handler error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function OPTIONS(req: Request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Allow': 'POST',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
        },
    });
}