import { db } from "@/database/drizzle";
import { review, users } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import { and, desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        const userId = session.user.id;
        const reqBody = await request.json();
        const validatedData = reviewSchema.parse(reqBody);

        // check agar user ne already comment kiya hai
        const existingReview = await db
            .select()
            .from(review)
            .where(
                and(
                    eq(review.userId, userId),
                    eq(review.productId, validatedData.productId)
                )
            )
            .limit(1);

            if (existingReview.length > 0) {
                // Update existing review
                const updatedReview = await db
                    .update(review)
                    .set({
                        rating: validatedData.rating,
                        comment: validatedData.comment,
                    })
                    .where(
                        and(
                            eq(review.userId, userId),
                            eq(review.productId, validatedData.productId)
                        )
                    )
                    .returning();
    
                return NextResponse.json({
                    message: "Review updated successfully",
                    review: updatedReview[0],
                });
            }

            const newReview = await db.insert(review).values({
                userId,
                productId: validatedData.productId,
                rating: validatedData.rating,
                comment: validatedData.comment,
            }).returning();

            return NextResponse.json({
                message: "Review created successfully",
                review: newReview[0],
            }, {status: 201});

    } catch (error) {
        console.log("Error while creating review", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: "Validation failed",
                details: error.errors
            }, { status: 400 });
        }

        return NextResponse.json(
            { error: "Failed to create review" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        const reviews = await db
            .select({
                id: review.id,
                userId: review.userId,
                productId: review.productId,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
                updatedAt: review.createdAt,
                userName: users.name,
            })
            .from(review)
            .where(eq(review.productId, productId))
            .leftJoin(users, eq(review.userId, users.id))
            .orderBy(desc(review.createdAt));

        return NextResponse.json(reviews);
    } catch (error) {
        console.log("Error while fetching reviews", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}