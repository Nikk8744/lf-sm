'use client';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { CheckCircle } from 'lucide-react';
import { DeliverySchedule, Plan } from '../../types';
import PaymentForm from './PaymentForm';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import DeliveryScheduleForm from './DeliveryScheduleForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SubscriptionPlans = () => {
    const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [step, setStep] = useState<'delivery' | 'payment'>('delivery');
  const [deliverySchedule, setDeliverySchedule] = useState<DeliverySchedule | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/subscription-plans');
        if (!response.ok) {
          throw new Error('Failed to fetch subscription plans');
        }
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

    fetchPlans();
  }, []);

  const handlePlanSelect = async (plan: Plan) => {
    setSelectedPlan(plan);
    // setShowPaymentDialog(true);
    setShowDialog(true);
    setProcessingPlanId(plan.id);
    
    // try {
    //   const response = await fetch('/api/create-subscription-intent', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ planId: plan.id }),
    //     credentials: 'include', // Include cookies for auth
    //   });

    //   if (!response.ok) {
    //     const errorText = await response.text();
    //     console.error('Server response:', response.status, errorText);
    //     throw new Error(`Server returned ${response.status}: ${errorText}`);
    //   }

    //   const data = await response.json();
    //   if (!data.clientSecret) {
    //     throw new Error('No client secret received from server');
    //   }
    //   setClientSecret(data.clientSecret);
    // } catch (error) {
    //   console.error('Error initializing payment:', error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to initialize payment. Please try again.",
    //     variant: "destructive",
    //   });
    // //   setShowPaymentDialog(false);
    // } finally {
    //     setProcessingPlanId(null);
    // }
  };

  const handleDeliverySubmit = async (data: DeliverySchedule) => {
    setIsLoading(true);
    try {
      setDeliverySchedule(data);
      
      // Get the payment intent client secret
      const response = await fetch('/api/create-subscription-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan?.id,
        }),
      });

      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
      setStep('payment');
    } catch (error) {
      console.error('Error setting up subscription:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (result: any) => {
    setShowDialog(false);
    setStep('delivery');
    setSelectedPlan(null);
    setDeliverySchedule(null);
    // Handle success (redirect, show toast, etc.)

    router.push('/subscription-success');
    // router.push(`/subscription-success?subscription_id=${subscriptionId}`);
  };

  const handlePaymentError = (error: any) => {
    // Handle payment errors
    console.error('Payment error:', error);
    toast({
        title: "Error",
        description: "Payment processing failed. Please try again.",
        variant: "destructive",
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">No Subscription Plans Available</h3>
        <p className="text-gray-500">Please check back later for available subscription plans.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                ${Number(plan.price).toFixed(2)}/{plan.interval.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">{plan.description}</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Up to {plan.maxProducts} items per delivery
                </li>
                {/* Add more features */}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handlePlanSelect(plan)}
                disabled={processingPlanId === plan.name}
              >
                {processingPlanId === plan.name ? 'Processing...' : `Subscribe to ${plan.name}`}
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
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
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