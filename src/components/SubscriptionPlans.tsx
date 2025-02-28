'use client';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Check, Loader2 } from 'lucide-react';
import { DeliverySchedule, Plan } from '../../types';
import PaymentForm from './PaymentForm';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import DeliveryScheduleForm from './DeliveryScheduleForm';
import { Badge } from './ui/badge';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SubscriptionPlans = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [step, setStep] = useState<'delivery' | 'payment'>('delivery');
  const [deliverySchedule, setDeliverySchedule] = useState<DeliverySchedule | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription-plans');
      if (!response.ok) throw new Error('Failed to fetch subscription plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowDialog(true);
    setStep('delivery');
    setProcessingPlanId(plan.id);
  };

  const handleDeliverySubmit = async (deliveryData: DeliverySchedule) => {
    setIsLoading(true);
    setDeliverySchedule(deliveryData);
    
    try {
      const response = await fetch('/api/create-subscription-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan?.id,
          deliverySchedule: deliveryData,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create subscription intent');

      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
      setStep('payment');
    } catch (error) {
      console.error('Error setting up subscription:', error);
      toast({
        title: "Error",
        description: "Failed to set up subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No Subscription Plans Available</CardTitle>
          <CardDescription>Please check back later for available subscription plans.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col relative overflow-hidden transition-transform hover:scale-105 ${
              plan.name === 'Premium' ? 'border-green-500 shadow-lg' : ''
            }`}
          >
            {plan.name === 'Premium' && (
              <Badge 
                className="absolute top-4 right-4 bg-green-500"
              >
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-xl font-semibold">
                ${Number(plan.price).toFixed(2)}/{plan.interval.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-6 text-gray-600">{plan.description}</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Up to {plan.maxProducts} items per delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Free delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handlePlanSelect(plan)}
                disabled={processingPlanId === plan.id}
              >
                {processingPlanId === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {processingPlanId === plan.id ? 'Processing...' : `Choose ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {step === 'delivery' ? 'Set Delivery Schedule' : 'Payment Details'}
            </DialogTitle>
          </DialogHeader>

          {step === 'delivery' ? (
            <DeliveryScheduleForm
              onSubmit={handleDeliverySubmit}
              isLoading={isLoading}
            />
          ) : (
            clientSecret && selectedPlan && deliverySchedule && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: { theme: 'stripe' },
                  paymentMethodCreation: 'manual'
                }}
              >
                <PaymentForm
                  selectedPlan={selectedPlan}
                  deliverySchedule={deliverySchedule}
                  onSuccess={() => {
                    setShowDialog(false);
                    router.push('/subscription-success');
                  }}
                  onError={(error) => {
                    toast({
                      title: "Error",
                      description: "Payment processing failed. Please try again.",
                      variant: "destructive",
                    });
                  }}
                />
              </Elements>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionPlans;