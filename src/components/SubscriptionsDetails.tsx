'use client';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from '@/hooks/use-toast';

interface Subscription {
    id: string;
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
    currentPeriodEnd: string;
    plan: {
      name: string;
      price: number;
      interval: string;
      maxProducts: number;
    };
    deliverySchedule: {
      preferredDay: string;
      preferredTime: string;
      address: string;
    };
  }

const SubscriptionsDetails = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      const data = await response.json();
      setSubscriptions(data);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (subscriptionId: string, action: 'pause' | 'resume' | 'cancel') => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error(`Failed to ${action} subscription`);
      
      // Refresh subscriptions after action
      await fetchSubscriptions();
      
      toast({
        title: "Success",
        description: `Subscription ${action}d successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} subscription`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">No Active Subscriptions</h2>
        <p className="text-gray-500">You don&apos;t have any active subscriptions.</p>
        <Button className="mt-4" onClick={() => window.location.href = '/subscription-plans'}>
          Browse Plans
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
            {subscriptions.map((subscription) => (
                <Card key={subscription.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">{subscription.plan.name}</h3>
                            <p className="text-gray-500">
                                ${subscription.plan.price}/
                                {subscription.plan.interval}
                            </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                            subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {subscription.status}
                        </span>
                    </div>

                    <div className="space-y-2 mb-4">
                        <p>Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                        <p>Delivery: {subscription.deliverySchedule.preferredDay} at {subscription.deliverySchedule.preferredTime}</p>
                        <p>Address: {subscription.deliverySchedule.address}</p>
                    </div>

                    <div className="flex gap-2">
                        {subscription.status === 'ACTIVE' && (
                            <>
                                <Button 
                                    variant="outline"
                                    onClick={() => handleAction(subscription.id, 'pause')}
                                >
                                    Pause
                                </Button>
                                <Button 
                                    variant="destructive"
                                    onClick={() => handleAction(subscription.id, 'cancel')}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                        {subscription.status === 'PAUSED' && (
                            <Button 
                                onClick={() => handleAction(subscription.id, 'resume')}
                            >
                                Resume
                            </Button>
                        )}
                    </div>
                </Card>
            ))}
        </div>
  )
}

export default SubscriptionsDetails