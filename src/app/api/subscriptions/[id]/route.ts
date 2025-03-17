import { db } from "@/database/drizzle";
import { deliverySchedules, subscriptionPlans, subscriptions } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest, 
    // { params }: { params: { id: string } }
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await request.json();
        const { action } = body;

        const { id } = await context.params;


        const subscription = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
        if (!subscription || subscription[0]?.userId !== session.user.id) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        switch (action) {
            case "pause":
                // return handlePause(session.user.id);
                await stripe.subscriptions.update(subscription[0].stripeSubscriptionId, {
                    pause_collection: { behavior: 'void' }
                });
                await db.update(subscriptions)
                    .set({ status: 'PAUSED' })
                    .where(eq(subscriptions.id, id));
                break;
            case "cancel":
                // return handleCancel(session.user.id);
                await stripe.subscriptions.cancel(subscription[0].stripeSubscriptionId);
                await db.update(subscriptions)
                    .set({ status: 'CANCELLED' })
                    .where(eq(subscriptions.id, id));
                break;
            case "resume":
                // return handleResume(session.user.id);
                await stripe.subscriptions.update(subscription[0].stripeSubscriptionId, {
                    pause_collection: ''
                });
                await db.update(subscriptions)
                    .set({ status: 'ACTIVE' })
                    .where(eq(subscriptions.id, id));
                break;
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({
            message: `Subscription ${action}ed successfully`,
            subscription: subscription[0],
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating subscription:", error);
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    // { params }: { params: { id: string } }
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;


        const subscription = await db.select({
            subscriptions,
            plan: subscriptionPlans,
            deliverySchedule: deliverySchedules,
        })
            .from(subscriptions)
            .where(eq(subscriptions.id, id))
            .leftJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.id))
            .leftJoin(deliverySchedules, eq(subscriptions.id, deliverySchedules.subscriptionId));

        if (!subscription || subscription[0].subscriptions.userId !== session.user.id) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        const subscriptionData = {
            ...subscription[0].subscriptions,
            plan: subscription[0].plan,
            deliverySchedule: subscription[0].deliverySchedule
        };

        return NextResponse.json(subscriptionData);

    } catch (error) {
        console.error("Error fetching subscription:", error);
        return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
    }
}
