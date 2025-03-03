import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import RecentOrders from '@/components/dashboard/RecentOrders';
import { Card } from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

const FarmerDashboard = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect('/sign-in');
    }
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      {/* Metrics Cards */}
      <DashboardMetrics />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
          <RecentOrders />
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Top Products</h2>
          {/* <TopProducts /> */}
        </Card>
      </div>
    </div>
  )
}

export default FarmerDashboard