import { db } from "@/database/drizzle";
import { orderItems, orders, products } from "@/database/schema";
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
        const inventoryChecks = await Promise.all(
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
                    currentStock: availableQuantity
                };
            })
        );


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
        console.log("The user orders are", userOrders)

        return NextResponse.json(userOrders, { status: 200 })
    } catch (error) {
        console.log("error while fetching orders", error);
        return NextResponse.json(
            { error: "Failed to fetch your orders" },
            { status: 500 }
        )
    }
}