import { db } from "@/database/drizzle";
import { subscriptionPlans } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { planId } = body;
        console.log("Helloooooooooo from subscriptionnnnnnnnnnnnnnn");
        // Get plan details
        const plan = await db
            .select()
            .from(subscriptionPlans)
            .where(eq(subscriptionPlans.id, planId))
            .limit(1);

        if (!plan.length) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

        // Create SetupIntent
        const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
            metadata: {
                planId: planId,
            },
            usage: 'off_session',
        });
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: Math.round(Number(plan[0].price) * 100), // Convert to cents
        //     currency: 'usd',
        //     metadata: {
        //         planId: planId,
        //         userId: session.user.id,
        //     },
        // });
        return NextResponse.json({
            // clientSecret: paymentIntent.client_secret,
            clientSecret: setupIntent.client_secret,
        });

    } catch (error) {
        console.error("Error creating setup intent:", error);
        return NextResponse.json(
            { error: "Failed to initialize payment" },
            { status: 500 }
        );
    }
}