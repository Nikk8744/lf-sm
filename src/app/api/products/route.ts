import { db } from "@/database/drizzle"
import { products } from "@/database/schema"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const allProducts = await db
            .select()
            .from(products)
            
            .orderBy(desc(products.createdAt))

        if(!allProducts || allProducts.length === 0){
            return NextResponse.json(
                {error: "No Products Found"},
                {status: 200}
            )
        }

        return NextResponse.json(allProducts)
    } catch (error) {
        console.log("Error while fetching products",error)
        return NextResponse.json(
            {error: "Falied to fetch products"},
            { status: 500}
        )
    }
}