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

export function ProductCard({
        id,
        name,
        price,
        description,
        imageUrl,
        farmLocation,
        quantity,
}: ProductCardProps) {
    console.log("The image url is:", imageUrl)
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <Image src={imageUrl || './images/img1.webp'} alt="Product Image" width={1000} height={500} />
        {/* <Image src='https://www.pexels.com/photo/8-piece-of-carrot-on-brown-chopping-board-65174/' alt="Product Image" width={1000} height={500} /> */}
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
            <h1>Price: {price}</h1>
            <h1>Farm Location: {farmLocation}</h1>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Buy</Button>
        <Button>Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}
