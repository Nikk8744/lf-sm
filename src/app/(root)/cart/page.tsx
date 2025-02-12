"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-6">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center bg-white p-6 rounded-lg shadow-md space-x-6"
            >
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
                {/* <p className="text-gray-500">Farm Location: {item.farmLocation}</p> */}
                <p className="mt-2 text-lg font-bold">Price: ${item.price}</p>
              </div>

              {/* Quantity and Remove */}
              <div className="flex flex-col items-center">
                <div className="flex space-x-4 items-center">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdateQuantity(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-xl">{item.quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="outline"
                  color="red"
                  onClick={() => handleRemove(item.productId)}
                  className="mt-4"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center">
            <p className="text-lg font-semibold" >Your cart is empty!</p>
            <Link href='/products' className="mx-3">
              <Button variant="default" className=" font-semibold"><Plus />Add Items</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Proceed to Checkout Button */}
      <div className="flex mt-10 flex-row-reverse justify-between">
        <Button variant='destructive' className="font-semibold" onClick={clearCart}>Clear Cart</Button>
        {cart.length > 0 && (
          <div className="flex justify-end gap-14 items-center">
            <Link href="/checkout">
              <Button>Proceed to Checkout</Button>
            </Link>
            <h1 className="text-2xl font-semibold">Total Amount: ${total}</h1>
          </div>
        )}
      </div>
    </div>
  );
}
