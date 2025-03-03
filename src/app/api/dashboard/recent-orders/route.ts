import { db } from "@/database/drizzle";
import { orderItems, orders, products, users } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return new Response("Unauthorized", {status: 401})
        }

        const farmerId = session.user.id;

        const recentOrders = await db.select({
            id: orders.id,
            createdAt: orders.createdAt,
            status: orders.orderStatus,
            customerName: users.name,
            total: orderItems.totalPrice,
        }).from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.farmerId, farmerId))
        .orderBy(desc(orders.createdAt))
        .limit(5);


        console.log("The recent orders are:", recentOrders);
        return NextResponse.json(recentOrders);
        // return new Response(JSON.stringify(recentOrders));
    } catch (error) {
        return NextResponse.json(
              { error: `Failed to fetch dashboard stats, ${error}` },
              { status: 500 }
            );
    }
}