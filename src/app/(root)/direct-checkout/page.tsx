'use client'

import { Button } from "@/components/ui/button";
import { useDirectPurchaseStore } from "@/store/useDirectPurchaseStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const DirectCheckoutPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
  const { product, clearProduct } = useDirectPurchaseStore();
  console.log("The product isssss",product)

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (!session?.user) {
      router.push('./sign-in');
    }
    console.log("The product in useeffect isssss",product)
    // Redirect to products if no product is selected
    if (!product) {
      router.push('/products');
    }

    // Cleanup function to clear the product when leaving the page
    return () => {
      clearProduct();
    };
  }, [product, router, session, clearProduct]);

  if (!session || !product) {
    return null; // Return null while redirecting or waiting for product data
  }

  const total = product.price * product.quantity;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Summary</h1>
      <div className="space-y-6">
        <div className="flex items-center bg-white p-6 rounded-lg shadow-md space-x-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Image
              src={product.imageUrl || "https://via.placeholder.com/150"}
              alt={product.name}
              width={100}
              height={100}
              className="object-cover rounded"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-500">Farm Location: {product.farmLocation}</p>
            <p className="mt-2 text-lg font-bold">Price: ${product.price}</p>
          </div>

          {/* Quantity */}
          <div className="flex flex-col items-center">
            <span className="text-xl">{product.quantity}</span>
            <p>Total: ${total}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-lg">
          <p className="font-semibold">Order Total: ${total}</p>
          <p className="text-sm text-gray-500 mt-1">Including taxes and shipping</p>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => router.push('/products')}>
            Cancel
          </Button>
          <Link href="/checkout/payment">
            <Button className="px-8 py-2">
              Proceed to Payment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DirectCheckoutPage;
