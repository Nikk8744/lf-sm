'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { formatDistance } from 'date-fns';
  
  interface Order {
    id: string;
    createdAt: string;
    status: string;
    customerName: string;
    total: number;
  }

const RecentOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/dashboard/recent-orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>
              <Badge variant={
                order.status === 'COMPLETED' ? 'success' :
                order.status === 'PENDING' ? 'warning' : 'default'
              }>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}</TableCell>
            <TableCell className="text-right">${order.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default RecentOrders