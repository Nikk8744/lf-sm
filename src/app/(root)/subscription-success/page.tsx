'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type SubscriptionDetails = {
  id: string;
  planName: string;
  amount: string;
  status: string;
  currentPeriodEnd: string;
  deliverySchedule: {
    preferredDay: string;
    preferredTime: string;
    address: string;
    instructions: string;
  };
};

const SubscriptionSuccess = () => {
  const router = useRouter();
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        // Get the subscription ID from URL parameters
        const params = new URLSearchParams(window.location.search);
        const subscriptionId = params.get('subscription_id');

        if (!subscriptionId) {
          throw new Error('No subscription ID found');
        }

        const response = await fetch(`/api/subscriptions/${subscriptionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch subscription details');
        }

        const data = await response.json();
        setSubscriptionDetails(data);
      } catch (error) {
        console.error('Error fetching subscription details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Subscription Activated Successfully!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you for subscribing. Your fresh produce delivery service is now active.
          </p>
        </div>

        {subscriptionDetails && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Subscription Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="text-gray-800">{subscriptionDetails.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="text-gray-800">${subscriptionDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-gray-800">{subscriptionDetails.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Period Ends:</span>
                <span className="text-gray-800">
                  {new Date(subscriptionDetails.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Delivery Schedule</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preferred Day:</span>
                    <span className="text-gray-800">
                      {subscriptionDetails.deliverySchedule.preferredDay}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preferred Time:</span>
                    <span className="text-gray-800">
                      {subscriptionDetails.deliverySchedule.preferredTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Address:</span>
                    <span className="text-gray-800 text-right">
                      {subscriptionDetails.deliverySchedule.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-4">
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go Home
          </Button>
          <Button
            onClick={() => router.push("/account/subscriptions")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Manage Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;