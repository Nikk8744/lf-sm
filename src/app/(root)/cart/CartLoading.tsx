import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import React from "react";

const CartLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-8" /> {/* Page title */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-32 h-32 rounded-md" />{" "}
                  {/* Product image */}
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" /> {/* Product name */}
                    <Skeleton className="h-4 w-1/4" /> {/* Price */}
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-24" /> {/* Quantity control */}
                      <Skeleton className="h-8 w-20" /> {/* Remove button */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" /> {/* Summary title */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-10 w-full" /> {/* Checkout button */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartLoading;
