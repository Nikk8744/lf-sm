'use client';
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { Card, CardContent } from "@/components/ui/card";

export default function SubscriptionPlansPage() {
  return (
    <div className="min-h-screen py-10 bg-[#EEEEEE]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Fresh Produce Subscriptions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get regular deliveries of fresh, local produce directly from our farmers. 
            Choose a plan that suits your needs and enjoy farm-fresh vegetables and fruits.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">1</div>
                <h3 className="font-semibold mb-2">Choose Your Plan</h3>
                <p className="text-gray-600">Select a subscription plan that matches your household needs</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">2</div>
                <h3 className="font-semibold mb-2">Set Delivery Schedule</h3>
                <p className="text-gray-600">Pick your preferred delivery day and time</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                <h3 className="font-semibold mb-2">Enjoy Fresh Produce</h3>
                <p className="text-gray-600">Receive regular deliveries of fresh, local produce</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SubscriptionPlans />

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Subscription Benefits</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Fresh & Local</h3>
              <p className="text-gray-600">Direct from local farmers to your doorstep</p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Flexible Delivery</h3>
              <p className="text-gray-600">Choose your preferred delivery schedule</p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">Better prices than buying individually</p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Support Local</h3>
              <p className="text-gray-600">Help sustain local farming communities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}