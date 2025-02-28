'use server'
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
        
        console.log("Received shipping address:", shippingAddress);

        if (!shippingAddress) {
            return NextResponse.json(
                { error: 'Shipping address is required' },
                { status: 400 }
            );
        }

        console.log("The shipping address in payment intentttt issssssssssssssss :", shippingAddress)

        const shippingAddressString = typeof shippingAddress === 'object' 
            ? JSON.stringify(shippingAddress)
            : shippingAddress;

        // Debug log
        console.log("Shipping address to be stored in metadata:", shippingAddressString);

        // Simplify items data to reduce metadata size
        const simplifiedItems = items.map((item: { productId: string; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
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
                shippingAddress: shippingAddress,
                userId: session.user.id,
            },

        })
        console.log("Created payment intent with metadata:", paymentIntent.metadata);

        return NextResponse.json({clientSecret: paymentIntent.client_secret })
    } catch (error) {
        console.log("Internal error", error) 
        return NextResponse.json(
            {error: `Internal server error ${error}`},
            {status: 500}
        )
    }
}