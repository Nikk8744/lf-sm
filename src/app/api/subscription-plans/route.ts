import { db } from "@/database/drizzle";
import { subscriptionPlans } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { convertIntervalToStripe, createStripePrice, createStripeProduct } from "@/lib/stripe/subscription-helper";
import { subscriptionPlansSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if(!session /*|| session.user.role !== "ADMIN" */) {
            return new Response("Unauthorized", {status: 401})
        }

        const body = await request.json();
        const validatedData = subscriptionPlansSchema.parse(body);

        // creating the stripe product
        const stripeProduct = await createStripeProduct(validatedData.name, validatedData.description);

        // creating the stripe proice
        const stripePrice = await createStripePrice(
            stripeProduct.id,
            validatedData.price,
            convertIntervalToStripe(validatedData.interval),
        );

        const newPlan = await db.insert(subscriptionPlans).values({
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price.toString(), // Convert number to string for decimal field
            interval: validatedData.interval,
            isActive: validatedData.isActive ?? true,
            maxProducts: validatedData.maxProducts,
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
        }).returning();

        return NextResponse.json({
            message: "Subscription plan created successfully",
            plan: newPlan,
        }, {status: 201})

    } catch (error) {
        console.error("Error creating subscription plan:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: "Validation failed",
                details: error.errors
            }, { status: 400 });
        }

        return NextResponse.json(
            { error: "Failed to create subscription plan" },
            { status: 500 }
        );
    }
};

export async function GET() {
    try {
        const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));

        return NextResponse.json(plans, {status: 200});
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        return NextResponse.json(
            { error: "Failed to fetch subscription plans" },
            { status: 500 }
        );
    }
}