import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest){
    try {

        const session = await getServerSession(authOptions);
        if(!session){
            return new Response("Unauthorized", {status: 401})
        };

        const { amount, purchaseType, items, shippingAddress } = await request.json();
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }
        // Simplify items data to reduce metadata size
        const simplifiedItems = items.map((item: any) => ({
            id: item.productId,
            qty: item.quantity,
        }));

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: {
                purchaseType: purchaseType,
                // items: JSON.stringify(items),
                itemsCount: items.length.toString(),
                itemsJson: JSON.stringify(simplifiedItems),
                shippingAddress,
                userId: session.user.id,
            },

        })

        return NextResponse.json({clientSecret: paymentIntent.client_secret })
    } catch (error) {
        console.log("Internal error", error) 
        return NextResponse.json(
            {error: `Internal server error ${error}`},
            {status: 500}
        )
    }
}