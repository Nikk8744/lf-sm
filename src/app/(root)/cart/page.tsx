"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/useCartStore";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import CartLoading from "./CartLoading";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, initializeCart } =
    useCartStore();
  const [productStocks, setProductStocks] = useState<Record<string, number>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const { removeItemFromCart, updateItemQuantity } = useCart();

  // Calculate subtotal
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // Calculate shipping
  const shippingFee = subtotal > 50 ? 0 : 5;

  // Calculate total
  const total = subtotal + shippingFee;

  useEffect(() => {
    const fetchCartItems = async () => {
      if (status === "unauthenticated") {
        router.push("/sign-in");
        return;
      }

      try {
        const response = await fetch("/api/cart");
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const items = await response.json();
        if (cart.length === 0) {
          initializeCart(items);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        toast({
          title: "Error",
          description: "Failed to fetch cart items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!isInitialized) {
      fetchCartItems();
    }

    fetchCartItems();
  }, [status, router, initializeCart, toast, cart, isInitialized]);

  // Sync cart changes with backend
  useEffect(() => {
    const syncCart = async () => {
      if (!session?.user) return;

      try {
        // console.log("The cart issss::::", cart);
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "sync", items: cart }),
        });
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };

    if (isInitialized) {
      const timeoutId = setTimeout(syncCart, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [cart, session?.user, isInitialized]);

  // Fetch product stock information
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    const fetchProductStocks = async () => {
      if (cart.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const stockData: Record<string, number> = {};

      try {
        await Promise.all(
          cart.map(async (item) => {
            const response = await fetch(`/api/products/${item.productId}`);
            if (!response.ok)
              throw new Error(`Failed to fetch product ${item.productId}`);

            const product = await response.json();
            const availableStock = product.quantity || 0;
            stockData[item.productId] = availableStock;

            // If current quantity exceeds stock, update it
            if (item.quantity > availableStock) {
              updateQuantity(item.productId, availableStock);
              toast({
                title: "Quantity adjusted",
                description: `${item.name} quantity adjusted to match available stock (${availableStock})`,
                variant: "destructive",
              });
            }
          })
        );

        setProductStocks(stockData);
      } catch (error) {
        console.error("Error fetching product stocks:", error);
        toast({
          title: "Error",
          description: "Failed to fetch product stock information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductStocks();
  }, [cart, status, router, updateQuantity, toast]);

  const handleUpdateQuantity = useCallback(
    async (productId: string, newQuantity: number) => {
      if (newQuantity < 1) return;

      const maxAvailable = productStocks[productId] || 0;
      if (newQuantity > maxAvailable) {
        toast({
          title: "Maximum quantity reached",
          description: `Only ${maxAvailable} items available in stock`,
          variant: "destructive",
        });
        return;
      }

      try {
        updateQuantity(productId, newQuantity);
        await updateItemQuantity(productId, newQuantity);
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive",
        });
      }
    },
    [productStocks, updateQuantity, toast, updateItemQuantity]
  );

  const handleRemove = useCallback(
    async (productId: string) => {
      try {
        removeFromCart(productId);
        await removeItemFromCart(productId);
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart",
        });
      } catch (error) {
        console.error("Error removing item from cart:", error);
        toast({
          title: "Error",
          description: "Failed to remove item",
          variant: "destructive",
        });
      }
    },
    [removeFromCart, toast, removeItemFromCart]
  );

  const handleClearCart = useCallback(() => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  }, [clearCart, toast]);

  if (isLoading) {
    return <CartLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {cart.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </Badge>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.productId} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="hover:text-primary transition-colors"
                        >
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                        </Link>
                        <p className="text-gray-500 text-sm mt-1">
                          Farm Location: {item.farmLocation}
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-lg font-bold text-green-600">
                            ${item.price}
                          </p>
                          <p className="text-lg font-semibold">
                            Total: ${item.price * item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >=
                              (productStocks[item.productId] || 0)
                            }
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-gray-500 ml-2">
                            ({productStocks[item.productId] || 0} available)
                          </span>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item.productId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shippingFee === 0 ? "Free" : `$${shippingFee}`}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">${total}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full flex items-center justify-center gap-2">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full text-red-500 hover:bg-red-50 hover:text-red-700 border-red-200"
                    onClick={handleClearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Link href="/products">
              <Button className="flex items-center gap-2">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
