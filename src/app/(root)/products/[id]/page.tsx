'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailsProps {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  farmLocation: string;
}

const ProductDetails = ({
  id,
  name,
  price,
  description,
  imageUrl,
  farmLocation,
}: ProductDetailsProps) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      productId: id,
      name,
      price,
      quantity: 1,
      imageUrl,
      farmLocation,
    });
    alert("Product added to cart!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
        {/* Product Image */}
        <div className="w-full lg:w-1/2">
          <Image
            src={imageUrl || 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg'}
            alt={name}
            width={500}
            height={500}
            className="object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Information */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h1 className="text-4xl font-semibold text-gray-800">{name}</h1>
          <p className="mt-2 text-lg text-gray-600">{description}</p>

          {/* Price and Farm Location */}
          <div className="mt-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-green-600">${price}</h2>
            <p className="text-lg text-gray-500">Farm Location: {farmLocation}</p>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6">
            <Button onClick={handleAddToCart} className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Add to Cart
            </Button>
          </div>

          {/* Back to Product List Link */}
          <div className="mt-4 text-center">
            <Link href="/products">
              <Button variant="outline" className="w-full py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100">
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
