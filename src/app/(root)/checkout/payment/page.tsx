"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/store/useCartStore";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import Checkout from "@/components/Checkout";
import { useDirectPurchaseStore } from "@/store/useDirectPurchaseStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  console.error("Stripe publishable key is not set");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const PaymentPage = () => {
  const { cart} = useCartStore();
  const { product} = useDirectPurchaseStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [shippingAddress, setShippingAddress] = useState("")

  useEffect(() => {
    // Get shipping details from localStorage
    const shippingDetails = localStorage.getItem("shippingDetails");
    if (shippingDetails) {
      const details = JSON.parse(shippingDetails);
      // Format the address
      const formattedAddress = `${details.name}, ${details.address}, ${details.city}`;
      // setShippingAddress(details);
      setShippingAddress(formattedAddress);
    }
  }, []);

  const calculateAmount = () => {
    if (product) {
      return Number(product.price * product.quantity);
    }
    if (!cart || cart.length === 0) {
      return 0; // Handle empty cart case
    }
    if (cart && cart.length > 0) {
      return Number(cart.reduce((total, item) => total + item.price * item.quantity,0)); 
    }
  };
  const amount = Number(calculateAmount());

  const getPurchaseType = () => {
    return product ? "direct" : "cart";
  };

  const handlePaymentSuccess = async () => {
    setPaymentStatus('completed');
    router.push('/payment-success');

    console.log("Payment Successfulllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
    // await send
  };

  const handlePaymentFailure = () => {
    setPaymentStatus('failed');
    console.log("Payment Faileddddddddddddddddddddddddddddddddd");
    router.push('/payment-failed')
  };
  

  useEffect(() => {
    if (!session?.user) {
      router.push('/sign-in');
      return;
    }
    if (!product && (!cart || cart.length === 0)) {
      router.push('/products');
    }
  }, [router, session, product, cart])
  
  if (!session) {
    return null;
  }
  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-12 px-4">
      <h1 className="text-4xl text-gray-800 font-semibold mb-8">
        Complete Your Payment of ${amount}
      </h1>
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd",
          }}
        >
          <Checkout 
            amount={amount} 
            purchaseType={getPurchaseType()} 
            handlePaymentSuccess={handlePaymentSuccess}
            handlePaymentFailure={handlePaymentFailure} 
            shippingAddress={shippingAddress}
          />
        </Elements>
      </div>

      {/* Display Payment Status */}
      {/* {paymentStatus === 'completed' && (
        <div className="mt-4 text-green-600">
          Payment Successful! Thank you for your order.
        </div>
      )}
      {paymentStatus === 'failed' && (
        <div className="mt-4 text-red-600">
          Payment failed. Please try again.
        </div>
      )} */}
    </div>
  );
};

export default PaymentPage;
