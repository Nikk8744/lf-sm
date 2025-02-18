'use client'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const OrderDetailPage = () => {
    // const orderId = params.orderId as string;
    const params = useParams() as { orderId: string };
    const orderId = params.orderId;
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(!orderId) return;

        const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if(!response.ok){
                throw new Error("Failed to fetch order details")
            }
            
            const order = await response.json();
            setOrder(order)
        } catch (error) {
            toast({
                title: `Error ${error}`,
                description: "Failed to fetch order details",
                variant: "destructive",
            })
        } finally {
            setLoading(false);
        }
        }

        fetchOrderDetails()
    }, [orderId])

    if (loading) {
        return (
          <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <p className="text-lg text-gray-700">Loading order details...</p>
          </div>
        );
      }
    
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Order Details</h2>
        <div className="space-y-4 border-b pb-4">
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Order ID:</span> {order?.id}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Date:</span>{" "}
            {new Date(order?.createdAt as Date).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Total Amount:</span> ${order?.totalAmount}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Order Status:</span> {order?.orderStatus}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Payment Status:</span> {order?.paymentStatus}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Payment Method:</span> {order?.paymentMethod}
          </p>
          <p className="text-lg text-gray-800">
            <span className="font-semibold">Shipping Address:</span> {order?.shippingAddress}
          </p>
        </div>
        <div className="mt-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Items</h3>
           {order?.items.length === 0 ? (
            <p className="text-lg text-gray-700">No items found for this order.</p>
          ) : (
            <div className="space-y-6">
              {order?.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-6 p-4 border rounded-lg">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || "Product Image"}
                      width={100}
                      height={100}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-semibold text-gray-900">{item.name}</p>
                    <p className="text-base text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-base text-gray-600">Unit Price: ${item.unitPrice}</p>
                    <p className="text-base text-gray-600">Total: ${item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-end">
          <Button
            onClick={() => router.push("/orders")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-lg font-medium"
          >
            Back to Orders
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage