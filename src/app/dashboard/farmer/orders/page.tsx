"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistance } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  totalPrice: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: "PENDING" | "SHIPPED" | "DELIVERED";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED";
  customerName: string;
  totalAmount: number;
  items: OrderItem[];
}

const FarmerOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        // console.log("The data is", data);
        if (Array.isArray(data)) {
            setOrders(data);
          } else {
            throw new Error("Invalid data format");
          }
        // setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "DELIVERED":
        return "myVariant2";
      case "SHIPPED":
        return "default";
      default:
        return "destructive";
    }
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "COMPLETED":
        return "myVariant";
      case "FAILED":
        return "destructive";
      default:
        return "default";
    }
  };    
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/dashboard/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update order status, ${error}`,
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

   if (!loading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No orders found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    {formatDistance(new Date(order.createdAt), new Date(), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {order?.items.map((item) => item.name).join(", ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Order Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Order Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p className="text-sm">{selectedOrder?.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-sm">${selectedOrder?.totalAmount}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder?.items.map((item, index) => (
                    <div key={index} className="text-sm flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${item.totalPrice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select
                  disabled={updatingStatus}
                  onValueChange={(value) => 
                    selectedOrder && handleStatusUpdate(selectedOrder.id, value as Order['status'])
                  }
                  defaultValue={selectedOrder?.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    {/* <SelectItem value="PROCESSING">Processing</SelectItem> */}
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    {/* <SelectItem value="CANCELLED">Cancelled</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerOrdersPage;
