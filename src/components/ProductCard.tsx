import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js
// import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useDirectPurchaseStore } from "@/store/useDirectPurchaseStore";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { ProductCardProps } from "../../types";
import { useCart } from "@/hooks/use-cart";

export function ProductCard({
  id,
  name,
  price,
  description,
  imageUrl,
  farmLocation,
}: ProductCardProps) {
  // const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();
  const session = useSession();
  const { toast } = useToast();
  const { setProduct } = useDirectPurchaseStore();
  const { addItemToCart } = useCart();

  // console.log("The session isssss",session)
  const handleAddToCart = async () => {
    if (!session.data) {
      router.push("/sign-in");
      return;
    }
    // addToCart({
    //   productId: id,
    //   name,
    //   price,
    //   quantity: 1,
    //   imageUrl,
    //   farmLocation,
    // });

    await addItemToCart({
      productId: id,
      name: name,
      price: price,
      quantity: 1,
      imageUrl: imageUrl,
      farmLocation: farmLocation,
    });

    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart`,
      duration: 2000,
    });
  };

  const handleBuyNow = () => {
    if (!session.data) {
      router.push("/sign-in");
      return;
    }
    // setDirectPurchase({
    //   productId: id,
    //   name,
    //   price,
    //   quantity: 1,
    //   imageUrl,
    //   farmLocation,
    // });
    setProduct({
      productId: id,
      name,
      price,
      quantity: 1,
      imageUrl,
      farmLocation,
    }); // Set the product in the store
    router.push("/direct-checkout"); // Redirect to the Direct Checkout page
    // Navigate to checkout

    router.push("/direct-checkout");
  };

  return (
    <Card className="w-full h-[400px] sm:h-[500px] flex flex-col bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex-shrink-0 p-3 sm:p-4">
        <div className="relative w-full h-40 xs:h-48 sm:h-56 border-b border-gray-500 rounded-lg">
          <Image
            src={
              imageUrl ||
              "https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg"
            }
            alt="Product Image"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 transform hover:scale-105 rounded-md"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>

        {/* Directly using Link without the <a> tag */}
        <div className="p-2 sm:p-3">
          <Link href={`./products/${id}`}>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 hover:text-blue-600">
              {name}
            </CardTitle>
          </Link>
          <CardDescription className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="text-sm sm:text-base font-semibold text-gray-800">
            Price: <span className="text-green-600">${price}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            Farm Location: {farmLocation}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 gap-2 mt-auto">
        <Button
          onClick={handleBuyNow}
          variant="outline"
          className="flex-1 py-2 h-8 sm:h-10 text-xs sm:text-sm font-semibold text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Buy Now
        </Button>
        <Button
          onClick={handleAddToCart}
          className="flex-1 py-2 h-8 sm:h-10 text-xs sm:text-sm font-semibold text-white rounded-md hover:bg-blue-700"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
