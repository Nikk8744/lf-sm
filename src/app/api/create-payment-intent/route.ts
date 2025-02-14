import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest){
    try {
        const { amount, purchaseType } = await request.json();
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: {
                purchaseType: purchaseType,
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