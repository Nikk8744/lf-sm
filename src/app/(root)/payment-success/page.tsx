"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useDirectPurchaseStore } from "@/store/useDirectPurchaseStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// type Order = {
//   id: string;
//   totalAmount: string;
//   orderStatus: string;
//   shippingAddress: string;
// };

const PaymentSuccess = () => {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { product, clearProduct } = useDirectPurchaseStore();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders");
        if (response.ok) {
          const data = await response.json();
          // Assuming the latest order is the first in the array
          if (data && data.length > 0) {
            setOrderDetails(data[0]);
          }
          console.log("The response isdss::", data);
        }
      } catch (error) {
        console.error("Error while fetching order details", error);
      }
    };

    fetchOrderDetails();

    // Clear cart and direct purchase product on mount
    if (product) clearProduct();
    if (cart && cart.length > 0) clearCart();
    // clear shipping details from localstorage - ye krna optional hai but its preffered
    localStorage.removeItem("shippingDetails");
  }, []);
  console.log("The order details are:", orderDetails);
  console.log("The order shipping address details are:",orderDetails?.shippingAddress);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 rounded-full p-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Payment Successful!
          </h2>
          <p className="mt-2 text-gray-600 text-center">
            Thank you for your purchase. Your order has been processed and will
            be shipped soon.
          </p>
        </div>

        {orderDetails && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Order Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="text-gray-800">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-gray-800">
                  ${orderDetails.totalAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-gray-800">
                  {orderDetails.orderStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Address:</span>
                <span className="text-gray-800 text-right">
                  {orderDetails.shippingAddress}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-4">
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </Button>
          <Button
            onClick={() => router.push("/products")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
