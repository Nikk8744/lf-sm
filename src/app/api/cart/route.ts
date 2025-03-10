import { db } from "@/database/drizzle";
import { cartItems, products } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                error: "Unauthorized!!",
                status: 401,
            })
        }

        const body = await request.json();
        // console.log("the body isss:::::", body);

        if (body.type === "ADD_ITEM") {
            const { productId, quantity = 1 } = body;

            const existingItem = await db.select()
                .from(cartItems)
                .where(
                    and(
                        eq(cartItems.userId, session.user.id),
                        eq(cartItems.productId, productId)
                    )
                ).execute();

            if (existingItem.length > 0) {
                await db.update(cartItems)
                    .set({
                        quantity: existingItem[0].quantity + quantity,
                        updatedAt: new Date()
                    })
                    .where(
                        and(
                            eq(cartItems.userId, session.user.id),
                            eq(cartItems.productId, productId)
                        )
                    )
                    .execute();
            } else {
                await db.insert(cartItems)
                    .values({
                        userId: session.user.id,
                        productId,
                        quantity,
                    })
                    .execute();
            }
        }
        // Update quantity
        else if (body.type === "UPDATE_QUANTITY") {
            const { productId, quantity } = body;

            await db.update(cartItems)
                .set({
                    quantity,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(cartItems.userId, session.user.id),
                        eq(cartItems.productId, productId)
                    )
                )
                .execute();
        }
        // Remove item
        else if (body.type === "REMOVE_ITEM") {
            const { productId } = body;

            await db.delete(cartItems)
                .where(
                    and(
                        eq(cartItems.userId, session.user.id),
                        eq(cartItems.productId, productId)
                    )
                )
                .execute();
        }
        // Clear cart
        else if (body.type === "CLEAR_CART") {
            await db.delete(cartItems)
                .where(eq(cartItems.userId, session.user.id))
                .execute();
        }

        return GET();
    } catch (error) {
        return NextResponse.json({ error: `Failed to add to cart, ${error}` }, { status: 500 });
    }
}



export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                error: "Unauthorized!!",
                status: 401,
            })
        }

        const cartData = await db.select({
            productId: cartItems.productId,
            quantity: cartItems.quantity,
            name: products.name,
            price: products.price,
            imageUrl: products.image,
            farmLocation: products.farmLocation,
        }).from(cartItems)
            .leftJoin(products, eq(cartItems.productId, products.id))
            .where(eq(cartItems.userId, session.user.id));
        // console.log("All cart itemsss areeeeee::::", cartData);

        return NextResponse.json(cartData);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
}


export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                error: "Unauthorized!!",
                status: 401,
            })
        }

        // update the quantity of the product in the cart
        await db.delete(cartItems).where(
            and(
                eq(cartItems.userId, session.user.id),
            )
        );

        return NextResponse.json({
            message: "Product removed from cart",
            status: 200,
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
    }
}