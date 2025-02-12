'use client'
// import { useCartStore } from "@/lib/useCartStore"; // Your Zustand cart store
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";

const CheckoutPage = () => {
  const { cart } = useCartStore((state) => state);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Summary</h1>
      <div className="space-y-6">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.productId} className="flex items-center bg-white p-6 rounded-lg shadow-md space-x-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <Image
                  src={item.imageUrl || "https://via.placeholder.com/150"}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-500">Farm Location: {item.farmLocation}</p>
                <p className="mt-2 text-lg font-bold">Price: ${item.price}</p>
              </div>

              {/* Quantity */}
              <div className="flex flex-col items-center">
                <span className="text-xl">{item.quantity}</span>
                <p>Total: ${item.price * item.quantity}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty!</p>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Total: ${calculateTotal()}</h2>
        <Link href="/checkout/shipping">
          <Button>Proceed to Shipping</Button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;
