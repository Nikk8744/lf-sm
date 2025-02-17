"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchOrders = async () => {
    try {
      const response = await fetch("api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch your orders");
      }
      const orders = await response.json();
      setOrders(orders);
    } catch (error) {
      toast({
        title: `Error: ${error}`,
        description: "Failed to fetch your orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold">No Orders Found</h2>
        <p className="mt-2">You haven&apos;t placed any orders yet.</p>
        <Button onClick={() => router.push("/products")} className="mt-4">
          Start Shopping
        </Button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Order History
        </h2>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order ID:</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Date:</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Amount
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    ${order.totalAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Order Status
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {order.orderStatus}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Payment Status
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Payment Method
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">
                  Shipping Address
                </p>
                <p className="text-gray-800">{order.shippingAddress}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            onClick={() => router.push("/products")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
