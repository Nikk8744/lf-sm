import { db } from "@/database/drizzle";
import { orders, orderTracking } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { trackingUpdateSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


// Define the type for tracking status
type TrackingStatus = 
    | 'ORDER_PLACED'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PACKED'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED';

// Add type to the messages object
export const defaultTrackingMessages: Record<TrackingStatus, string> = {
    ORDER_PLACED: "Order has been placed successfully",
    CONFIRMED: "Payment has been confirmed",
    PROCESSING: "Order is being processed",
    PACKED: "Order has been packed and ready for shipping",
    SHIPPED: "Order has been shipped and is on its way",
    OUT_FOR_DELIVERY: "Order is out for delivery",
    DELIVERED: "Order has been delivered successfully"
};

// Helper function with proper typing
function getOrderStatus(trackingStatus: TrackingStatus): 'PENDING' | 'SHIPPED' | 'DELIVERED' {
    if (['ORDER_PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED'].includes(trackingStatus)) {
        return 'PENDING';
    } else if (['SHIPPED', 'OUT_FOR_DELIVERY'].includes(trackingStatus)) {
        return 'SHIPPED';
    } else if (trackingStatus === 'DELIVERED') {
        return 'DELIVERED';
    }
    return 'PENDING';
}

export async function POST(request: NextRequest,  { params }: {params: { orderId: string }}) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new Response("Unauthorized", {status: 401})
        };

        const body = await request.json();
        const validatedData = trackingUpdateSchema.parse(body);

        const trackingMessage = validatedData.message || defaultTrackingMessages[validatedData.status] || `Status updated to ${validatedData.status}`;


        const [newTracking] = await db.insert(orderTracking).values({
            orderId: params.orderId,
            status: validatedData.status,
            message: trackingMessage,
            location: validatedData.location,
            updatedBy: session?.user.id,
        }).returning();

        const orderStatus = getOrderStatus(validatedData.status);
        await db.update(orders).set({ orderStatus }).where(eq(orders.id, params.orderId));

        return NextResponse.json({
            message: "Tracking updated successfully",
            tracking: newTracking,
        }, {status: 200})

    } catch (error) {
        console.error("Error updating tracking:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid tracking data" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update tracking" }, { status: 500 });
    }
}


export async function GET(request: NextRequest, { params }: { params: { orderId: string }}) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new Response("Unauthorized", {status: 401})
        };
        const { orderId } = await Promise.resolve(params);

        const trackingHistory = await db.select().from(orderTracking)
            .where(eq(orderTracking.orderId, orderId))
            .orderBy(orderTracking.createdAt);

        return NextResponse.json(trackingHistory, {status: 200})
    } catch (error) {
        console.error("Error fetching tracking history:", error);
        return NextResponse.json(
            { error: "Failed to fetch tracking history" },
            { status: 500 }
        );
    }
}