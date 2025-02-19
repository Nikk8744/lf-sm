"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CalendarDays, CreditCard, Package, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrderDetailPage = () => {
  // const orderId = params.orderId as string;
  const params = useParams() as { orderId: string };
  const orderId = params.orderId;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const order = await response.json();
        setOrder(order);
      } catch (error) {
        toast({
          title: `Error ${error}`,
          description: "Failed to fetch order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusColor = (
    status: string
  ): "secondary" | "destructive" | "default" | "outline" | "myVariant" => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "processing":
        return "secondary";
      case "shipped":
        return "outline";
      case "delivered":
        return "myVariant";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (
    status: "PENDING" | "COMPLETED" | "FAILED"
  ): "secondary" | "destructive" | "default" | "outline" | "myVariant" => {
    switch (status) {
      case "COMPLETED":
        return "myVariant";
      case "FAILED":
        return "destructive";
      case "PENDING":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }
  if (!order) {
    return (
      <Card className="container mx-auto p-8 mt-8 text-center">
        <CardHeader>
          <CardTitle>Order Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="myVariant"
          onClick={() => router.push("/orders")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">
                  Order #{order.id}
                </CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <Badge
                variant={getStatusColor(order.orderStatus)}
                className="text-sm px-3 py-1"
              >
                {order.orderStatus}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Payment Information */}
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getPaymentStatusColor(order.paymentStatus)}
                      >
                        {order.paymentStatus}
                      </Badge>
                      <span className="text-muted-foreground">
                        via {order.paymentMethod}
                      </span>
                    </div>
                    <p className="font-medium">
                      Total Amount: ${order.totalAmount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <CardTitle>Order Items</CardTitle>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-4">
              {order.items.length === 0 ? (
                <p className="text-muted-foreground">
                  No items found for this order.
                </p>
              ) : (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary rounded-md flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.unitPrice}</p>
                        <p className="font-medium text-foreground">
                          Total: ${item.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
