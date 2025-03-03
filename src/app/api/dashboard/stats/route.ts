import { db } from "@/database/drizzle";
import { orderItems, orders, products } from "@/database/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session /*|| session.user.role !== "FARMER" */) {
      return new Response("Unauthorized", { status: 401 });
    }

    const farmerId = session.user.id;

    // Get total products
    const totalProducts = await db
      .select({ count: sql`count(*)` })
      .from(products)
      .where(eq(products.farmerId, farmerId));

    // Get total orders
    const totalOrders = await db
      .select({ count: sql`count(DISTINCT ${orders.id})` })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(products.farmerId, farmerId));
    console.log("Total orders are", totalOrders);

    // Get revenue
    const revenue = await db
      .select({
        total: sql`sum(${orderItems.totalPrice})`
      }).from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(
        and(
          eq(products.farmerId, farmerId),
          eq(orders.paymentStatus, "COMPLETED")
        )
      );

    return NextResponse.json({
      totalProducts: totalProducts[0].count,
      totalOrders: totalOrders[0].count,
      revenue: revenue[0].total || 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch dashboard stats, ${error}` },
      { status: 500 }
    );
  }
}