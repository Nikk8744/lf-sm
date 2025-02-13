"use client"
import React from 'react'
import { loadStripe } from "@stripe/stripe-js";
// import { useCartStore } from '@/store/useCartStore';
import { Elements } from '@stripe/react-stripe-js';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import Checkout from '@/components/Checkout';

if(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined){
  console.error("Stripe publishable key is not set");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const PaymentPage = () => {

  // const { cart } = useCartStore()

  // const total = () => {
  //   if(!cart || cart.length === 0) {
  //     return 0; // Handle empty cart case
  //   }
  //   const amount = cart.reduce((total, item) => total + item.price * item.quantity, 0); 
  //   if(amount > 0) return amount
    
  // }
 const amount = 10;


  return (
    <div className='flex flex-col items-center bg-slate-300 m-10 p-10'>
      <h1 className='text-3xl text-slate-900 font-semibold font-mono'>Payment Page</h1>
      <div>
        <Elements 
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd"
          }}
        >
          <Checkout amount={amount}/>
        </Elements>
      </div>
    </div>
  )
}

export default PaymentPage