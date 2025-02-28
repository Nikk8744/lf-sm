import SubscriptionsDetails from '@/components/SubscriptionsDetails';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

const SubscriptionsDashboard = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect('/sign-in');
    }
  return (
    <div className="min-h-screen bg-[#EEEEEE]">
            <div className="container mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Subscription Management</h1>
                    <p className="text-gray-600 mt-2">Manage your subscription plans and delivery schedules</p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2">
                    <SubscriptionsDetails />
                    
                    {/* Future components */}
                    <div className="space-y-6">
                        {/* Upcoming Deliveries Component */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Upcoming Deliveries</h2>
                            {/* Add upcoming deliveries content */}
                        </div>
                        
                        {/* Subscription Analytics Component */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Subscription Overview</h2>
                            {/* Add subscription analytics content */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default SubscriptionsDashboard