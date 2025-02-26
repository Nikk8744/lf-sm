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
        validatePaymentIntent(paymentIntent);

        // Parse the simplified items from metadata
        console.log("Raw metadata:", paymentIntent.metadata);
        const simplifiedItems = JSON.parse(paymentIntent.metadata.itemsJson || '[]');
        console.log("Parsed items:", simplifiedItems);

        const shippingAddress = paymentIntent.metadata.shippingAddress;
        if (!shippingAddress) {
            throw new Error('Shipping address not found in payment intent metadata');
        }     

        // If we get here, we know we have enough inventory
        const completeItems = await Promise.all(
            simplifiedItems.map(async (item: { productId: string; quantity: number }) => {
                const [product] = await db
                    .select()
                    .from(products)
                    .where(eq(products.id, item.productId));

                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                return {
                    productId: product.id,
                    quantity: item.quantity,
                    price: parseFloat(product.price),
                    name: product.name
                };
            })
        );

        const orderData = {
            items: completeItems,
            // items: simplifiedItems,
            totalAmount: paymentIntent.amount / 100,
            shippingAddress: paymentIntent.metadata.shippingAddress,
            paymentIntentId: paymentIntent.id,
            paymentMethod: paymentIntent.payment_method_types[0],
            userId: paymentIntent.metadata.userId,
            isWebhook: true,
        };

        console.log("Sending order data to API:", JSON.stringify(orderData, null, 2));

        const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        // this is not necessary but it helps in debugging
        const responseText = await orderResponse.text();
        console.log(`Order API response (${orderResponse.status}):`, responseText);

        if (!orderResponse.ok) {
            // const errorText = await orderResponse.text();
            // const errorData = JSON.parse(errorText);
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch (e) {
                errorData = { error: responseText || `Unknown error ${e}` };
            }

            // If it's an inventory error, we should handle it specially
            if (errorData.error && errorData.error.includes("Insufficient inventory")) {
                // Initiate refund
                await stripe.refunds.create({
                    payment_intent: paymentIntent.id,
                    reason: 'requested_by_customer',
                });
                console.log("Payment refunded due to insufficient inventory");
            }
            
            throw new Error(errorData.error || 'Failed to create order');
        }

        // const orderResult = await orderResponse.json();
        let orderResult;
        try {
            orderResult = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse order response:", e);
            throw new Error('Invalid response from order API');
        }
        return orderResult;
    } catch (error) {
        console.error("Error in createOrder:", error);
        throw error;
    }
}

async function sendConfirmationEmail(paymentIntent: Stripe.PaymentIntent, orderResult: { order: { id: string } }) {
    try {
        if (!orderResult || !orderResult.order || !orderResult.order.id) {
            console.error("Invalid order result:", orderResult);
            throw new Error("Invalid order result structure");
        }
        
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
    console.log(" 🔥🔥🔥🔥Webhook endpoint hittttttt", new Date().toISOString());
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


export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Allow': 'POST',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
        },
    });
}