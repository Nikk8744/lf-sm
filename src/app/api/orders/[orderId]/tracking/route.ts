import { db } from "@/database/drizzle";
import { orders, orderTracking } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { trackingUpdateSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Helper function to map tracking status to order status
function getOrderStatus(trackingStatus: string) {
    if (['ORDER_RECEIVED', 'PAYMENT_CONFIRMED', 'PROCESSING', 'PACKED'].includes(trackingStatus)) {
        return 'PENDING';
    } else if (['PICKED_BY_COURIER', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(trackingStatus)) {
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


        const [newTracking] = await db.insert(orderTracking).values({
            orderId: params.orderId,
            status: validatedData.status as any,
            message: validatedData.message,
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