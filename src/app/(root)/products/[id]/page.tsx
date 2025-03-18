"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { ArrowLeft, Loader2, MapPin, MinusCircle, Package, PlusCircle, ShoppingCart, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useDirectPurchaseStore } from "@/store/useDirectPurchaseStore";
import ProductReview from "@/components/ProductReview";

interface ProductDetailsProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  farmLocation: string;
  quantity: number;
  category?: string;
}

const ProductDetails = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const params = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetailsProps | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const { setProduct: setDirectPurchaseProduct } = useDirectPurchaseStore();

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && quantity < (product?.quantity || 0)) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        // console.log("The data is of product detailsssss iss",data);
        setProduct(data);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load product details, ${error}`,
          variant: "destructive",
        });
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, toast, router]);

  const handleAddToCart = () => {
    if (!session?.user) {
      router.push('/sign-in');
      return;
    }
    if (!product) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
      farmLocation: product.farmLocation,
    });
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    if (!session?.user) {
      router.push('/sign-in');
      return;
    }
    if (!product) return;

    setDirectPurchaseProduct({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
      farmLocation: product.farmLocation
    });
    router.push('/direct-checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="default"
        onClick={() => router.push('/products')}
        className="mb-6 flex items-center gap-2 hover:bg-secondary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border">
            <Image
              src={product?.image || 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg'}
              alt="Product Image"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Column - Product Information */}
        <div className="space-y-8">
          <div>
            {product?.category && (
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
            )}
            <h1 className="text-4xl font-bold text-gray-900">{product?.name}</h1>
            <div className="mt-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Farm Location: {product?.farmLocation}</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">${product?.price}</span>
                  <Badge variant={product && product?.quantity > 0  ? "outline" : "destructive"}>
                    {product && product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                {product && product?.quantity > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange('decrease')}
                        disabled={quantity <= 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange('increase')}
                        disabled={quantity >= (product?.quantity || 0)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleBuyNow}
                className="w-full"
                disabled={product?.quantity === 0}
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="w-full"
                disabled={product?.quantity === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Description</h2>
            <p className="text-gray-600 leading-relaxed">{product?.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Truck className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Free Delivery</h3>
                    <p className="text-sm text-gray-500">Orders over $50</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Same Day Dispatch</h3>
                    <p className="text-sm text-gray-500">Order before 2 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ProductReview productId={product!.id} />
    </div>
  );
};

export default ProductDetails;
