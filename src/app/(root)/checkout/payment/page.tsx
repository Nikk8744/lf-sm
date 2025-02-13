'use client';
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/store/useCartStore";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import Checkout from "@/components/Checkout";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  console.error("Stripe publishable key is not set");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const PaymentPage = () => {
  const { cart } = useCartStore();

  const amount = () => {
    if (!cart || cart.length === 0) {
      return 0; // Handle empty cart case
    }
    const amount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    if (amount > 0) return amount;
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-12 px-4">
      <h1 className="text-4xl text-gray-800 font-semibold mb-8">
        Complete Your Payment
      </h1>
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(Number(amount())),
            currency: "usd",
          }}
        >
          <Checkout amount={Number(amount())} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
