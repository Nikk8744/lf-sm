'use client'
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const Checkout = ({amount}: {amount: number}) => {

    const stripe = useStripe();
    const elements = useElements();
    
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    
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
            // Show the error to the user (e.g., payment details incomplete)
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
                    <div className="text-red-600 text-center mt-4">
                        {errorMessage}
                    </div>
                )}
                <div className="flex justify-center mt-8">
                    <Button disabled={!stripe || loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out">
                        {loading ? "Processing..." : "Pay Now"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Checkout;
