'use client';
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { Plan } from '../../types';

interface PaymentFormProps {
  selectedPlan: Plan;
  deliverySchedule: {
    preferredDay: string;
    preferredTime: string;
    address: string;
    instructions?: string;
  };
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}

const PaymentForm = ({ selectedPlan, deliverySchedule, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Create PaymentMethod
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        elements,
        params: {
          type: 'card',
        },
      });

      if (paymentMethodError) {
        throw paymentMethodError;
      }

      // Create subscription with the PaymentMethod
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          paymentMethodId: paymentMethod?.id,
          deliverySchedule,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Handle subscription activation
      const { clientSecret } = data;
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        throw confirmError;
      }

      onSuccess(data);
      toast({
        title: "Success!",
        description: `You've successfully subscribed to the ${selectedPlan.name} plan.`,
      });

    } catch (error) {
      console.error('Subscription error:', error);
      onError(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Selected Plan: {selectedPlan.name}</h3>
          <p className="text-sm text-muted-foreground">
            ${Number(selectedPlan.price).toFixed(2)}/{selectedPlan.interval.toLowerCase()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PaymentElement />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Processing...' : `Subscribe to ${selectedPlan.name}`}
      </Button>
    </form>
  );
};

export default PaymentForm;
