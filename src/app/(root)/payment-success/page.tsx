// src/app/payment-success/page.tsx (Order Confirmation Page)
"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useDirectPurchaseStore } from "@/store/useDirectPurchaseStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const router = useRouter();
  //   const { searchParams } = router.query;
  //   const amount = searchParams?.amount;
  const { cart, clearCart } = useCartStore();
  const { product, clearProduct } = useDirectPurchaseStore();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  useEffect(() => {
    // so now we can first fetch order details before clearing cart and product
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data[0]);
        }
      } catch (error) {
        console.log("Error while fetching order details", error);
      }
    };
    fetchOrderDetails();

    // Clear cart and product on mount of success page
    if (product) {
      clearProduct();
    }
    if (cart && cart.length > 0) {
      clearCart();
    }
  }, [cart, product, clearProduct, clearCart]);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold">Payment Successfull!</h2>
      <p className="mt-4">Thank you for your purchase.</p>
      <p>Your order has been processed, and will be shipped soon.</p>
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Order Details:</h3>
        {orderDetails && (
          <div className="mb-8 text-left">
            <div className="space-y-2">
              <p>Order ID: {orderDetails.id}</p>
              <p>Total Amount: ${orderDetails.totalAmount}</p>
              <p>Status: {orderDetails.orderStatus}</p>
              <p>Shipping Address: {orderDetails.shippingAddress}</p>
            </div>
          </div>
        )}
      </div>
      <Button onClick={() => router.push("/")} className="mt-4">
        Go Back to Home
      </Button>
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Payment Successful!
            </h2>
            <div className="mb-8">
              <p className="text-lg text-gray-700 mb-2">
                Thank you for your purchase.
              </p>
              <p className="text-gray-600">
                Your order has been processed and will be shipped soon.
              </p>
            </div>
            <Button
              onClick={() => router.push("/products")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
