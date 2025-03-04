"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ChevronRight, CreditCard, MapPin, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Order } from "../../../../types";

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

  const getStatusColor = (status: string): "secondary" | "destructive" | "default" | "outline" | "myVariant" => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary' 
      case 'processing':
        return 'secondary'
      case 'shipped':
        return 'outline' 
      case 'delivered':
        return 'myVariant'
      case 'cancelled':
        return 'destructive'
      default:
        return 'default'
    }
  }
  const getPaymentStatusColor = (status: "PENDING" | "COMPLETED" | "FAILED"): "secondary" | "destructive" | "default" | "outline" | "myVariant" => {
    switch (status) {
      case "COMPLETED":
        return "myVariant"
      case "FAILED":
        return "destructive"
      case "PENDING":
        return "secondary"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-4">
        <Skeleton className="h-12 w-[250px] mx-auto" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="container mx-auto p-8 mt-8 text-center">
        <CardHeader>
          <CardTitle>No Orders Found</CardTitle>
          <CardDescription>You haven&apos;t placed any orders yet.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => router.push("/products")}>
            Start Shopping
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">Order History</h1>
      <Button 
        onClick={() => router.push("/products")}
        variant="myVariantBtn"
      >
        Continue Shopping
      </Button>
    </div>
    <ScrollArea className="h-[800px]">
      <div className="space-y-4">
        {orders.map((order) => (
          <Card 
            key={order.id} 
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                  <CardDescription>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(order.orderStatus)} className="text-sm px-3 py-1">
                  {order.orderStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <span className="font-medium">Total Amount</span>
                      <p className="text-muted-foreground">${order.totalAmount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <span className="font-medium">Payment</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                        <span className="text-sm text-muted-foreground">via {order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">Delivery Address</span>
                      <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                    </div>
                  </div>
                </div>
                {order.items && order.items.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                            <span className="font-medium">${item.totalPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="p-6">
              <Button 
                onClick={() => router.push(`/orders/${order.id}`)}
                className="ml-auto flex items-center gap-2"
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  </div>
  );
};

export default OrdersPage;
