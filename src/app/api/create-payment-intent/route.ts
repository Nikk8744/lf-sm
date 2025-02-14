import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest){
    try {
        const { amount } = await request.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
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