"use client";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useDirectPurchaseStore } from "@/store/useDirectPurchaseStore";
import { CheckoutProps } from "../../types";
  
const Checkout = ({
  amount,
  purchaseType,
  handlePaymentSuccess,
  handlePaymentFailure,
  shippingAddress,
}: CheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCartStore();
  const { product } = useDirectPurchaseStore();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (!amount || amount <= 0) {
    //     setErrorMessage('Invalid amount');
    //     return;p
    // }
    const items = purchaseType === "direct" ? [product] : cart;
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: convertToSubcurrency(amount),
        purchaseType,
        items,
        shippingAddress,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
      // console.log("The shipping address issssssssssssssss:", shippingAddress)
  }, [amount, purchaseType, cart, product, shippingAddress]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      handlePaymentFailure();
      return;
    }

    // console.log("Helloooooooooooooooooooooooooooooo");
    // console.log(stripe.confirmPayment);

    // Store the purchase type in localStorage
    localStorage.setItem('lastPurchaseType', purchaseType);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          // return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
          return_url: `${window.location.origin}/payment-success?amount=${amount}&type=${purchaseType}`,
        },
        redirect: "if_required",
      });
      console.log("Stripe Payment Confirmation Response:", {
        error,
        paymentIntent,
      });

      if (error) {
        console.log("Payment error:", error);
        setErrorMessage(error.message || "An error occurred during payment");
        handlePaymentFailure(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // console.log("Payment successful!");
        handlePaymentSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred");
      handlePaymentFailure();
    }
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-transparent border-t-4 border-blue-600"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 w-full rounded-lg shadow-lg p-6 mt-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <h1>{clientSecret}</h1> */}
        {/* <PaymentElement options={paymentElementOptions} /> */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {clientSecret && <PaymentElement />}
        </div>
        {errorMessage && (
          <div className="text-red-600 text-center mt-4">{errorMessage}</div>
        )}
        <div className="flex justify-center mt-8">
          <Button
            disabled={!stripe || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
