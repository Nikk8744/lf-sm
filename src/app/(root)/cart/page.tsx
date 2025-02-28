"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/useCartStore";
import { ArrowRight, Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [productStocks, setProductStocks] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  // Fetch product stock information
  useEffect(() => {
    const fetchProductStocks = async () => {
      if (cart.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const stockData: any = {};
      
      try {
        // Fetch stock information for each product in cart
        await Promise.all(
          cart.map(async (item) => {
            const response = await fetch(`/api/products/${item.productId}`);
            if (!response.ok) return;
            
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductStocks();
  }, [cart, updateQuantity, toast]);

  const handleUpdateQuantity = useCallback((productId: string, newQuantity: number) => {
    // Don't allow quantity below 1
    if (newQuantity < 1) return;
    
    // Don't allow quantity above available stock
    const maxAvailable = productStocks[productId] || 0;
    if (newQuantity > maxAvailable) {
      toast({
        title: "Maximum quantity reached",
        description: `Only ${maxAvailable} items available in stock`,
        variant: "destructive",
      });
      return;
    }
    
    updateQuantity(productId, newQuantity);
  }, [productStocks, updateQuantity, toast]);

  const handleRemove = useCallback((productId: string) => {
    removeFromCart(productId);
  }, [removeFromCart]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {cart.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : cart.length > 0 ? (
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
                        src={item.imageUrl || "https://via.placeholder.com/150"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <Link href={`/products/${item.productId}`} className="hover:text-primary transition-colors">
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                        </Link>
                        <p className="text-gray-500 text-sm mt-1">Farm Location: {item.farmLocation}</p>
                        <p className="mt-2 text-lg font-bold text-green-600">${item.price}</p>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= (productStocks[item.productId] || 0)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
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
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{total > 50 ? "Free" : "$5.00"}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">${(total > 50 ? total : total + 5).toFixed(2)}</span>
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
                    onClick={clearCart}
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
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any products to your cart yet.</p>
            <Link href="/products">
              <Button className="flex items-center gap-2">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
