'use client'
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const Checkout = ({amount}: {amount: number}) => {

    const stripe = useStripe();
    const elements = useElements();
    
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("")
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        })
        .then((res) => res.json()) 
        .then((data) => setClientSecret(data.clientSecret))
    }, [amount])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true);

        if(!stripe || !elements){
            return
        }

        const {error: submitError } = await  elements.submit();

        if(submitError){
            setErrorMessage(submitError.message);
            setLoading(false)
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
            }
        })

        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            setErrorMessage(error.message);
          } else {
            // The payment UI automatically closes with a success animation.
            // Your customer is redirected to your `return_url`.
        }
        setLoading(false);
    }

    if (!clientSecret || !stripe || !elements) {
        return (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        );
      }
    //   const paymentElementOptions = {
    //     layout: "accordion",
    //   };
    return (
        <div>
            <form onSubmit={handleSubmit} className='bg-blue-400 p-10'>
                <h1>{clientSecret}</h1>
                {/* <PaymentElement options={paymentElementOptions} /> */}
                {clientSecret && <PaymentElement />}
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}err</div>}
                <Button disabled={!stripe || loading}>Pay</Button>
            </form>
        </div>
    )
}

export default Checkout