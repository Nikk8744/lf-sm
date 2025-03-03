import { db } from "@/database/drizzle";
import { orderItems, orders, products, users } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "FARMER") {
            return new Response("Unauthorized", { status: 401 });
        }

        const farmerId = session.user.id;

        const farmerOrders = await db.select({
            id: orders.id,
            createdAt: orders.createdAt,
            status: orders.orderStatus,
            paymentStatus: orders.paymentStatus,
            customerName: orders.userId,
            totalAmount: sql`SUM(${orderItems.totalPrice})`,
        }).from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.farmerId, farmerId))
        .groupBy(orders.id, orders.createdAt, orders.orderStatus, orders.paymentStatus, users.name)
        .orderBy(desc(orders.createdAt));

        // console.log("The farmer orders are:", farmerOrders);

        const orderWithItsItems = await Promise.all(
            farmerOrders.map(async (order) => {
                const items = await db.select({
                    name: products.name,
                    quantity: orderItems.quantity,
                    // unitPrice: orderItems.unitPrice,
                    totalPrice: orderItems.totalPrice,
                }).from(orderItems)
                .innerJoin(products, eq(orderItems.productId, products.id))
                .where(sql`${orderItems.orderId} = ${order.id} AND ${products.farmerId} = ${farmerId}`);

                return {
                    ...order,
                    items,
                };
            })
        );

        // return NextResponse.json(farmerOrders);
        return NextResponse.json(orderWithItsItems);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to fetch orders: ${error}` },
            { status: 500 }
        );
    }
}