'use client';
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Calendar, Leaf, ShieldCheck, Sprout, HeartHandshake, Wallet } from "lucide-react";

export default function SubscriptionPlansPage() {
  return (
    <div className="min-h-screen py-16 bg-[#EEEEEE]">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Fresh Produce Subscriptions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get regular deliveries of fresh, local produce directly from our farmers. 
            Choose a plan that suits your needs and enjoy farm-fresh vegetables and fruits.
          </p>
        </div>

        {/* How It Works Section */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Choose Your Plan</h3>
                <p className="text-gray-600">Select a subscription plan that matches your household needs and budget</p>
              </div>
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Set Delivery Schedule</h3>
                <p className="text-gray-600">Pick your preferred delivery day and time for maximum convenience</p>
              </div>
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Enjoy Fresh Produce</h3>
                <p className="text-gray-600">Receive regular deliveries of seasonal, locally-sourced produce</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans Component */}
        <div className="mb-16">
          <SubscriptionPlans />
        </div>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Subscriptions?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Fresh & Local</h3>
                <p className="text-gray-600">Direct from local farmers to your doorstep within 24 hours of harvest</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Quality Guaranteed</h3>
                <p className="text-gray-600">100% satisfaction guarantee with our fresh produce promise</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Better Value</h3>
                <p className="text-gray-600">Save up to 20% compared to regular store prices</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Support Local</h3>
                <p className="text-gray-600">Directly support local farmers and sustainable agriculture</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Preview */}
        {/* <Card className="bg-white/50 backdrop-blur">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Have Questions?</h2>
            <p className="text-gray-600 mb-6">
              Check out our frequently asked questions about our subscription service
            </p>
            <a 
              href="/faq" 
              className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center"
            >
              View FAQ
              <svg 
                className="w-4 h-4 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </a>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}