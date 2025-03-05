import { defaultTrackingMessages } from "@/app/api/orders/[orderId]/tracking/route";
import { db } from "@/database/drizzle";
import { orders, orderTracking } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { orderId: string }}) {

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "FARMER") {
            return new Response("Unauthorized", { status: 401 });
        }

        const { status } = await request.json();

        const updateOrder = await db.update(orders)
            .set({ orderStatus: status, updatedAt: new Date() })
            .where(eq(orders.id, params.orderId))
            .returning();

        // Update order tracking status 
        await db.update(orderTracking)
            .set({ 
                status, 
                message: defaultTrackingMessages[status] || `Status updated to ${status}`,
                updatedBy: session.user.id,
            })
            .where(eq(orderTracking.orderId, params.orderId));

        return NextResponse.json({
            message: "Order status updated successfully",
            order: updateOrder[0],
            status: 200,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
    }
}