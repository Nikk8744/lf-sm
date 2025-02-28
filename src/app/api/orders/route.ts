import { db } from "@/database/drizzle";
import { orderItems, orders, orderTracking, products } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations";
import { desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {

        const body = await request.json();

        const validatedData = createOrderSchema.parse(body);
        const { items, totalAmount, shippingAddress, paymentMethod, paymentIntentId, userId, isWebhook } = validatedData;

        // Check if order with this payment intent already exists
        const existingOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.paymentIntentId, paymentIntentId));
        
        if (existingOrders.length > 0) {
            console.log(`Order already exists for payment intent ${paymentIntentId}`);
            return NextResponse.json({
                success: true,
                message: "Order already processed",
                order: existingOrders[0],
            });
        }

        // this check is to ensure that if its a webhook request then skip the session check as its server-to-server request
        if (!isWebhook) {
            const session = await getServerSession(authOptions);
            if (!session) {
                return new Response("Unauthorized", { status: 401 })
            };
            // Ensure user can only create orders for themselves
            if (session.user.id !== userId) {
                return new NextResponse("Forbidden", { status: 403 });
            }
        }

        // Check inventory for all items in a transaction-like manner
        const verifiedItems = await Promise.all(
            items.map(async (item) => {
                const [product] = await db
                    .select()
                    .from(products)
                    .where(eq(products.id, item.productId));

                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                const availableQuantity = product.quantity || 0;
                if (availableQuantity < item.quantity) {
                    throw new Error(`Insufficient inventory for product ${product.name}`);
                }

                return {
                    ...item,
                    product,
                    currentStock: availableQuantity
                };
            })
        );

        console.log(`Creating order for user ${userId} with ${verifiedItems.length} items`);


        // console.log("The req body is", reqBody)
        // const authenticatedUserId = userId;

        // const result = await db.transaction(async (tx) => {
        // creating the order
        const [newOrder] = await db.insert(orders).values({
            userId,
            totalAmount: totalAmount.toString(),
            shippingAddress,
            paymentMethod,
            paymentIntentId,
            paymentStatus: "COMPLETED",
            orderStatus: "PENDING",
        }).returning();
        console.log("The new oprder issss", newOrder)

        // creating the order items and updating the product quantity
        await Promise.all(items.map(async (item) => {
            // Create order item
            await db.insert(orderItems).values({
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price.toString(),
                totalPrice: (item.price * item.quantity).toString(),
            });

            // Update inventory
            await db.update(products)
                .set({
                    quantity: sql`quantity - ${item.quantity}`,
                })
                .where(eq(products.id, item.productId));
        }));

        await db.insert(orderTracking).values({
            orderId: newOrder.id,
            status: 'ORDER_PLACED' as any,
            message: 'Order has been placed successfully',
            updatedBy: userId,
        });

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Order created successfully",
            // order: result,
            order: newOrder,
        })

    } catch (error) {
        console.log("Error occurred while creating order", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error },
                { status: 400 }
            );
        }

        // Handle specific error cases
        if (error instanceof Error) {
            if (error.message.includes("Insufficient inventory")) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 400 }
                );
            }
            if (error.message.includes("not found")) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 404 }
                );
            }
        }
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 })
        };

        const userOrders = await db.select().from(orders).where(eq(orders.userId, session.user.id)).orderBy(desc(orders.createdAt));
        // console.log("The user orders are", userOrders)

        return NextResponse.json(userOrders, { status: 200 })
    } catch (error) {
        console.log("error while fetching orders", error);
        return NextResponse.json(
            { error: "Failed to fetch your orders" },
            { status: 500 }
        )
    }
}