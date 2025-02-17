import { db } from "@/database/drizzle";
import { orderItems, orders, products } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        
        // const body = await request.json();
        const { items, totalAmount, shippingAddress, paymentMethod, paymentIntentId, userId, isWebhook } = await request.json();

        // this check is to ensure that if its a webhook request then skip the session check as its server-to-server request
        if(!isWebhook){
            const session = await getServerSession(authOptions);
            if(!session){
                return new Response("Unauthorized", {status: 401})
            };
        }

        // console.log("The req body is", reqBody)
        const authenticatedUserId = userId;

        const [newOrder] = await db.insert(orders).values({
            userId: authenticatedUserId,
            totalAmount: totalAmount.toString(),
            shippingAddress,
            paymentMethod,
            paymentIntentId,
            paymentStatus: "COMPLETED",
            orderStatus: "PENDING",
        }).returning();


        for(const item of items){
            await db.insert(orderItems).values({
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price.toString(),
                totalPrice: (item.price * item.quantity).toString(),
            })
            
            await db.update(products).set({
                quantity: sql`${products.quantity} - ${item.quantity}`
                // quantity: products.quantity - item.quantity,
            }).where(eq(products.id, item.productId))
        };

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Order created successfully",
            order: newOrder,
        })

    } catch (error) {
        console.log("Error occurred while creating order", error);
        return NextResponse.json(
            {error: "Failed to create you order"},
            {status: 500}
        )
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new Response("Unauthorized", {status: 401})
        };

        const userOrders = await db.select().from(orders).where(eq(orders.userId, session.user.id)).orderBy(desc(orders.createdAt)) as Order[];

        return NextResponse.json(userOrders, {status: 200})
    } catch (error) {
        console.log("error while fetching orders", error);
        return NextResponse.json(
            {error: "Failed to fetch your orders"},
            {status: 500}
        )
    }
}