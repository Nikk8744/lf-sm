'use client'
import ShippingForm from '@/components/ShippingForm'
import { Card } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const ShippingPage = () => {
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  return (
    <div className="min-h-screen py-8 mt-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Shipping Information</h1>
          <ShippingForm />
        </Card>
      </div>
    </div>
  )
}

export default ShippingPage