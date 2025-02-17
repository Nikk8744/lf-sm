import { db } from "@/database/drizzle"
import { products } from "@/database/schema"
import { and, desc, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("query")?.toLowerCase();
        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const filters = [];

        if(query) {
            filters.push(
                sql`(LOWER(${products.name}) LIKE ${`%${query}%`} OR 
                    LOWER(${products.description}) LIKE ${`%${query}%`})`
            )
        }

        // if(category){
        //     filters.push(sql`${products.category} = ${category}`)
        // }

        // if(minPrice){
        //     filters.push(sql`${products.price} >= ${minPrice}`)
        // }
        // if(maxPrice){
        //     filters.push(sql`${products.price} <= ${maxPrice}`)
        // }

        if(category && category !== "") {
            // Use ilike for case-insensitive comparison
            filters.push(sql`LOWER(${products.category}) = LOWER(${category})`)
        }

        if(minPrice && !isNaN(Number(minPrice))) {
            filters.push(sql`CAST(${products.price} AS DECIMAL) >= ${Number(minPrice)}`)
        }

        if(maxPrice && !isNaN(Number(maxPrice))) {
            filters.push(sql`CAST(${products.price} AS DECIMAL) <= ${Number(maxPrice)}`)
        }

        const whereClause = filters.length > 0 ? and(...filters) : undefined;
        console.log("Filters:", filters);
        console.log("Category value:", category);
        console.log("Generated SQL:", whereClause);
        console.log("The where clause issss",whereClause)

        const allProducts = await db
            .select()
            .from(products)
            .where(whereClause)
            .orderBy(desc(products.createdAt))
        console.log("The products are here",allProducts)
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