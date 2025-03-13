'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { useCartStore } from '@/store/useCartStore'
import { useDirectPurchaseStore } from '@/store/useDirectPurchaseStore'
import { AlertCircle, ArrowLeft, RefreshCw, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const PaymentFailed = () => {
    const router = useRouter();
  // const { cart } = useCartStore();
  const { product } = useDirectPurchaseStore();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Get error details from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      setErrorDetails(error);
    }
  }, []);

  const handleRetryPayment = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      router.push("/checkout/payment");
    } else {
      // If user has tried too many times, redirect to cart
      router.push(product ? "/direct-checkout" : "/checkout");
    }
  };

  const handleBackToCart = () => {
    router.push(product ? "/direct-checkout" : "/checkout");
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
                <CardDescription className="text-red-600">
                  We couldn&apos;t process your payment
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            <div className="space-y-4">
              <p className="text-gray-700">
                Unfortunately, your payment could not be processed. This could be due to:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Insufficient funds in your account</li>
                <li>Incorrect payment details</li>
                <li>Your card issuer declined the transaction</li>
                <li>A temporary issue with our payment system</li>
              </ul>
              
              {errorDetails && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm text-red-700 font-medium">Error details:</p>
                  <p className="text-sm text-red-600">{errorDetails}</p>
                </div>
              )}
              
              <div className="pt-2">
                <p className="text-gray-700 font-medium">
                  What would you like to do next?
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={handleBackToCart}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {product ? "Checkout" : "Cart"}
            </Button>
            
            <Button 
              variant="default" 
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 flex items-center gap-2"
              onClick={handleRetryPayment}
              disabled={retryCount >= 3}
            >
              <RefreshCw className="h-4 w-4" />
              {retryCount < 3 ? "Try Again" : "Too Many Attempts"}
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={handleContinueShopping}
            >
              <ShoppingCart className="h-4 w-4" />
              Continue Shopping
            </Button>
          </CardFooter>
        </Card>
        
        {retryCount >= 3 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
            <p className="font-medium">Too many payment attempts</p>
            <p className="mt-1">
              For security reasons, we&apos;ve limited the number of payment attempts. 
              Please review your payment details or try a different payment method.
            </p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@farmmart.com" className="text-blue-600 hover:underline">
              support@farmmart.commm
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed