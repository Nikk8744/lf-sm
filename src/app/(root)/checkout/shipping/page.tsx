import ShippingForm from '@/components/ShippingForm'
import React from 'react'

const ShippingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shipping Page</h1>
        <div>
            <ShippingForm />
        </div>
    </div>
  )
}

export default ShippingPage