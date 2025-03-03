'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
}

export function DashboardMetrics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = [
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: stats?.revenue ? `$${stats.revenue}` : '$0',
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        return (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              <Icon className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <h3 className="text-2xl font-bold">
                  {loading ? "Loading..." : metric.value}
                </h3>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}