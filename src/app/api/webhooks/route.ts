import { db } from "@/database/drizzle";
import {
  deliverySchedules,
  orderItems,
  products,
  subscriptionPlans,
  subscriptions,
  users,
} from "@/database/schema";
import { validatePaymentIntent } from "@/lib/helpers/payment";
import {
  sendOrderConfirmationEmail,
  sendSubscriptionConfirmationEmail,
} from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

async function createOrder(paymentIntent: Stripe.PaymentIntent) {
  try {
    validatePaymentIntent(paymentIntent);

    // aprse the simplified items from metadata
    console.log("Raw metadata:", paymentIntent.metadata);
    const simplifiedItems = JSON.parse(
      paymentIntent.metadata.itemsJson || "[]"
    );
    console.log("Parsed items:", simplifiedItems);

    const shippingAddress = paymentIntent.metadata.shippingAddress;
    if (!shippingAddress) {
      throw new Error("Shipping address not found in payment intent metadata");
    }

    // uf we get here, we know we have enough inventory
    const completeItems = await Promise.all(
      simplifiedItems.map(
        async (item: { productId: string; quantity: number }) => {
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
            name: product.name,
          };
        }
      )
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

    console.log(
      "Sending order data to API:",
      JSON.stringify(orderData, null, 2)
    );

    const orderResponse = await fetch(
    //   `${process.env.NEXT_PUBLIC_APP_URL}/api/orders`,
      "/api/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );

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
      if (
        errorData.error &&
        errorData.error.includes("Insufficient inventory")
      ) {
        // Initiate refund
        await stripe.refunds.create({
          payment_intent: paymentIntent.id,
          reason: "requested_by_customer",
        });
        console.log("Payment refunded due to insufficient inventory");
      }

      throw new Error(errorData.error || "Failed to create order");
    }

    // const orderResult = await orderResponse.json();
    let orderResult;
    try {
      orderResult = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse order response:", e);
      throw new Error("Invalid response from order API");
    }
    return orderResult;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
}

async function sendConfirmationEmail(
  paymentIntent: Stripe.PaymentIntent,
  orderResult: { order: { id: string } }
) {
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
    const formattedItems = items.map((item) => ({
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
      orderItems: formattedItems.map((item) => ({
        name: item.name || "Unnamed Product",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      totalAmount: (paymentIntent.amount / 100).toString(),
      shippingAddress: paymentIntent.metadata.shippingAddress || "Not provided",
    });
    console.log("Email sent successfully");
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

async function sendSubscriptionEmail(subscription: Stripe.Subscription) {
  try {
    let userId = subscription.metadata?.userId;

    // If not in metadata, try to get from customer
    if (!userId && subscription.customer) {
      const customer = (await stripe.customers.retrieve(
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id
      )) as Stripe.Customer;
      // Check if customer is not deleted and has metadata
      if (!("deleted" in customer) && customer.metadata?.userId) {
        userId = customer.metadata.userId;
      }
    }

    if (!userId) {
      console.error("No userId found in subscription or customer metadata");
      return;
    }

    // Get user and plan details from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, subscription.metadata.userId));

    if (!user?.email) {
      throw new Error("User email not found");
    }

    // Get subscription details from our database
    const [dbSubscription] = await db
      .select({
        subscription: subscriptions,
        plan: subscriptionPlans,
        delivery: deliverySchedules,
      })
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
      .leftJoin(
        subscriptionPlans,
        eq(subscriptions.planId, subscriptionPlans.id)
      )
      .leftJoin(
        deliverySchedules,
        eq(subscriptions.id, deliverySchedules.subscriptionId)
      );

    if (!dbSubscription) {
      throw new Error("Subscription details not found");
    }

    await sendSubscriptionConfirmationEmail({
      to: user.email,
      customerName: user.name || "Valued Customer",
      planName: dbSubscription.plan?.name || "Unknown Plan",
      price: dbSubscription.plan?.price || "Unknown Price",
      interval: dbSubscription.plan?.interval || "Unknown Interval",
      deliverySchedule: {
        preferredDay: dbSubscription.delivery?.preferredDay as string,
        preferredTime: dbSubscription.delivery?.preferredTime as string,
        address: dbSubscription.delivery?.address as string,
        instructions: dbSubscription.delivery?.instructions || undefined,
      },
    });

    console.log("Subscription confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending subscription confirmation email:", error);
    throw error;
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
      console.log(
        `PaymentIntent for ${paymentIntent.amount_received} was successful!`
      );

      try {
        // Check if this is a subscription-related payment
        if (paymentIntent.metadata?.type === "subscription") {
          // Handle subscription payment differently
          console.log("Subscription payment processed successfully");
          return NextResponse.json({ success: true });
        }
        if (
          !paymentIntent.metadata.type ||
          paymentIntent.metadata.type === "order"
        ) {
          const orderResult = await createOrder(paymentIntent);
          // console.log("Order created successfully", orderResult)

          await sendConfirmationEmail(paymentIntent, orderResult);
          console.log("Comnfirmation Email sent successfully");
          return NextResponse.json({
            success: true,
            order: orderResult.order.id,
            message: "Order created and email sent successfully",
          });
        }
        return NextResponse.json({ success: true });
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
      console.log(
        `PaymentIntent for ${paymentIntent.amount_received} has failedddddddd!`
      );
      // You can update the order status in your database here
      return NextResponse.json({
        success: false,
        error: "Payment failed",
        paymentIntentId: paymentIntent.id,
      });
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const statusMapping: Record<string, SubscriptionStatus> = {
        active: "ACTIVE",
        // 'past_due': 'PAST_DUE',
        canceled: "CANCELLED",
        paused: "PAUSED",
      };
      await db
        .update(subscriptions)
        .set({
          status: statusMapping[subscription.status],
          currentPeriodStart: new Date(
            subscription.current_period_start * 1000
          ),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

      // Send subscription confirmation email
      if (subscription.status === "active") {
        await sendSubscriptionEmail(subscription);
      }
      console.log("Subscription confirmation email sent successfully");

      return NextResponse.json({ success: true });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(subscriptions)
        .set({
          status: "CANCELLED",
          cancelAtPeriodEnd: true,
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

      return NextResponse.json({ success: true });
    }

    // Handle invoice payment success for subscriptions
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await db
          .update(subscriptions)
          .set({
            status: "ACTIVE",
            currentPeriodEnd: new Date(invoice.period_end * 1000),
          })
          .where(
            eq(
              subscriptions.stripeSubscriptionId,
              invoice.subscription as string
            )
          );
      }
      return NextResponse.json({ success: true });
    }

    // Handle invoice payment failure
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await db
          .update(subscriptions)
          .set({
            status: "PAUSED",
          })
          .where(
            eq(
              subscriptions.stripeSubscriptionId,
              invoice.subscription as string
            )
          );
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({
      received: true,
    });
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
      Allow: "POST",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type, stripe-signature",
    },
  });
}
