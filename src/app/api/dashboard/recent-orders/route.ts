import { db } from "@/database/drizzle";
import { orderItems, orders, products, users } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== "FARMER"){
            return new Response("Unauthorized", {status: 401})
        }

        const farmerId = session.user.id;

        const recentOrders = await db.select({
            id: orders.id,
            createdAt: orders.createdAt,
            status: orders.orderStatus,
            customerName: users.name,
            total: sql`SUM(${orderItems.totalPrice})`.mapWith(Number),
        }).from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.farmerId, farmerId))
        .groupBy(orders.id, orders.createdAt, orders.orderStatus, users.name)
        .orderBy(desc(orders.createdAt))
        .limit(5);


        // console.log("The recent orders are:", recentOrders);
        return NextResponse.json(recentOrders);
        // return new Response(JSON.stringify(recentOrders));
    } catch (error) {
        return NextResponse.json(
              { error: `Failed to fetch dashboard stats, ${error}` },
              { status: 500 }
            );
    }
}