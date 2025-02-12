"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/store/useCartStore"


export function ProductCard({
        id,
        name,
        price,
        description,
        imageUrl,
        farmLocation,
        // quantity,
}: ProductCardProps) {
    // console.log("The image url is:", imageUrl)

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      productId: id,
      name,
      price,
      quantity: 1,
      imageUrl,
      farmLocation,
    })
    alert("Product added to cart!!!")
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <Image src={imageUrl || 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg'} alt="Product Image" width={1000} height={1000} className="object-fill" />
        <Link href={`./products/${id}`} className="hover:scale-110 hover:text-blue-600"><CardTitle>{name}</CardTitle></Link>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
            <h1>Price: <b>${price}</b></h1>
            <h1>Farm Location: {farmLocation}</h1>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href='./order'><Button variant="outline">Buy</Button></Link>
        <Link href='./cart'><Button onClick={handleAddToCart} > Add to Cart</Button></Link>
      </CardFooter>
    </Card>
  )
}
