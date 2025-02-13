'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const OrderConfirmationPage = () => {
  const router = useRouter();
//   const { orderId } = router.query;  // Assume orderId is passed as a query parameter

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
      <p>Your order has been successfully processed!</p>
      {/* <p>Order ID: {orderId}</p> */}
      <Button onClick={() => router.push("/")} className="mt-4">Back to Home</Button>
    </div>
  );
};

export default OrderConfirmationPage;
