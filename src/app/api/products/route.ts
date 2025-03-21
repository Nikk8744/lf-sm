import { db } from "@/database/drizzle"
import { products } from "@/database/schema"
import { authOptions } from "@/lib/auth";
import { productSchema, productUpdateSchema } from "@/lib/validations";
import { and, desc, eq, sql } from "drizzle-orm"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("query")?.toLowerCase();
        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const farmLocation = searchParams.get("farmLocation");
        const filters = [];
        const limitParam = parseInt(searchParams.get('page') || '1');
        const limitSize = 16;
        const limit = parseInt(searchParams.get("limit") || '0');
        // const limitValue = limitParam ? parseInt(limitParam) : undefined;


        if(query) {
            filters.push(   
                sql`(LOWER(${products.name}) LIKE ${`%${query}%`} OR 
                    LOWER(${products.description}) LIKE ${`%${query}%`})`
            )
        }

        // console.log("The page issssss:::::",limitParam);

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

        if(farmLocation && farmLocation !== "") {
            filters.push(sql`LOWER(${products.farmLocation}) = LOWER(${farmLocation})`)
        }

        const whereClause = filters.length > 0 ? and(...filters) : undefined;
        // console.log("Filters:", filters);
        // console.log("Category value:", category);
        // console.log("Generated SQL:", whereClause);
        // console.log("The where clause issss",whereClause)
       
        const totalCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(products)
            .where(whereClause);
        
        const totalCount = totalCountResult[0]?.count || 0;

        let allProducts;
        if (limitSize) {
            allProducts = await db
                .select()
                .from(products)
                .where(whereClause)
                .orderBy(desc(products.createdAt))
                .limit(limitSize)
                .offset((limitParam - 1) * limitSize);
        } else {
            allProducts = await db
                .select()
                .from(products)
                .where(whereClause)
                .orderBy();
        }

        if (limit){
            allProducts = await db
                .select()
                .from(products)
                .where(whereClause)
                .orderBy(desc(products.createdAt))
                .limit(limit);

                return NextResponse.json(allProducts)
        }
        // console.log("The products are here",allProducts)

        if(!allProducts || allProducts.length === 0){
            return NextResponse.json(
                {error: "No Products Found"}, 
                {status: 200}
            )
        }

        // return NextResponse.json(allProducts)
        return NextResponse.json({
            products: allProducts,
            totalPages: Math.ceil(totalCount / limitSize),
            currentPage: limitParam,
            totalProducts: totalCount
        });
    } catch (error) {
        console.log("Error while fetching products",error)
        return NextResponse.json(
            {error: "Falied to fetch products"},
            { status: 500}
        )
    }
}


export async function POST(request: NextRequest) {
    try {
        
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const farmerId = session.user.id;

        const reqBody = await request.json();
        const validatedData = productSchema.parse({
            ...reqBody,
            price: reqBody.price.toString(),
        });

        const newProduct = await db.insert(products).values({
            ...validatedData,
            farmerId,
        }).returning();

        return NextResponse.json({
            message: "Product created successfully",
            product: newProduct,
        }, {status: 201})
    } catch (error) {
        console.log("Error while creating product", error)

        if(error instanceof z.ZodError){
            return NextResponse.json({
                error: "Validation falied",
                details: error.errors
            }, { status: 400 });
        }

        return NextResponse.json(
            {error: "Failed to create product"},
            {status: 500}
        )
    }
}

// fot updating the product
export async function PUT(request: NextRequest) {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const farmerId = session.user.id;
        const reqBody = await request.json();
        const { id, ...updateData } = reqBody;
        if (!id) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        const validatedData = productUpdateSchema.parse({
            ...updateData,
            price: updateData.price?.toString(),
        })

        const existingProduct = await db
            .select()
            .from(products)
            .where(
                and(
                    eq(products.id, id),
                    eq(products.farmerId, farmerId)
                )
            ).limit(1);

        if(!existingProduct || existingProduct.length === 0){
            return NextResponse.json(
                {error: "Product not found"},
                {status: 404}
            )
        }

        const updatedProduct = await db
            .update(products)
            .set({
                ...validatedData,
                // updatedAt: new Date(), // i need to add an update at field in the schema
            })
            .where(
                and(
                    eq(products.id, id),
                    eq(products.farmerId, farmerId)
                )
            )
            .returning();

        return NextResponse.json({
            message: "Product updated successfully",
            product: updatedProduct,
        }, {status: 200})

    } catch (error) {
        console.log("Error while creating product", error)

        if(error instanceof z.ZodError){
            return NextResponse.json({
                error: "Validation falied",
                details: error.errors
            }, { status: 400 });
        }

        return NextResponse.json(
            {error: "Failed to update product"},
            {status: 500}
        )
    }
}


