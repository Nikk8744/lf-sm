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
import Link from "next/link";  // Import Link from Next.js
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
    if(!session.data){
      router.push('/sign-in');
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
    if(!session.data){
      router.push('/sign-in');
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
    router.push('/direct-checkout'); // Redirect to the Direct Checkout page
    // Navigate to checkout

    router.push('/direct-checkout');
  };

  return (
    <Card className="w-[350px] h-[500px] flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <div className="relative w-full h-56">
          <Image
            src={imageUrl || 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg'}
            alt="Product Image"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 transform hover:scale-105"
          />
        </div>
        {/* Directly using Link without the <a> tag */}
        <Link href={`./products/${id}`}>
          <CardTitle className="mt-2 text-xl font-semibold text-gray-800 hover:text-blue-600">
            {name}
          </CardTitle>
        </Link>
        <CardDescription className="mt-1 text-sm text-gray-600">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex justify-between mt-2">
          <h1 className="text-lg font-semibold text-gray-800">Price: <span className="text-green-600">${price}</span></h1>
          <h1 className="text-sm text-gray-600">Farm Location: {farmLocation}</h1>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between mt-4 gap-2">
        <Button onClick={handleBuyNow} variant="outline" className="w-full py-2 text-sm font-semibold text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100">
          Buy
        </Button>
        <Button onClick={handleAddToCart} className="w-full py-2 text-sm font-semibold text-white rounded-md hover:bg-blue-700">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
