import { defaultTrackingMessages, TrackingStatus } from "@/app/api/orders/[orderId]/tracking/route";
import { db } from "@/database/drizzle";
import { orders, orderTracking } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function PATCH(request: Request, context: { params: Promise<{ orderId: string }> }) {

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "FARMER") {
            return new Response("Unauthorized", { status: 401 });
        }

        const { status } = await request.json();
        // const { orderId } = params;
        const { orderId } = await context.params;

        // Map ORDER_STATUS_ENUM to ORDER_TRACKING_STATUS_ENUM
        let trackingStatus: TrackingStatus;
        switch(status) {
            case 'PENDING':
                trackingStatus = 'PROCESSING';
                break;
            case 'SHIPPED':
                trackingStatus = 'SHIPPED';
                break;
            case 'DELIVERED':
                trackingStatus = 'DELIVERED';
                break;
            default:
                trackingStatus = 'PROCESSING';
        }

        const updateOrder = await db.update(orders)
            .set({ orderStatus: status, updatedAt: new Date() })
            .where(eq(orders.id, orderId))
            .returning();

        // Update order tracking status 
        await db.update(orderTracking)
            .set({ 
                status,  
                message: defaultTrackingMessages[trackingStatus] || `Status updated to ${status}`,
                updatedBy: session.user.id,
            })
            .where(eq(orderTracking.orderId, orderId));

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