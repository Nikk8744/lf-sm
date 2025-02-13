// src/app/payment-success/page.tsx (Order Confirmation Page)
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const PaymentSuccess = () => {
  const router = useRouter();
//   const { searchParams } = router.query;
//   const amount = searchParams?.amount;

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold">Payment Successfull!</h2>
      <p className="mt-4">Thank you for your purchase.</p>
      <p>Your order has been processed, and will be shipped soon.</p>
      <div className="mt-6">
        <h3 className="font-semibold">Order Details:</h3>
        <ul>
          <li>Order ID: #123456</li>
          {/* <li>Total: ${amount}</li> */}
          {/* Add other order details */}
        </ul>
      </div>
      <Button onClick={() => router.push('/')} className="mt-4">
        Go Back to Home
      </Button>
    </div>
  );
};

export default PaymentSuccess;
