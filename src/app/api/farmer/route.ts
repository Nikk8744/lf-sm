import { db } from "@/database/drizzle";
import { products } from "@/database/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    
    const session = await getServerSession(authOptions);
    console.log("The role of user isssss::::", session);
    if (!session ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const farmerProducts = await db
      .select()
      .from(products)
      .where(eq(products.farmerId, session.user.id));
      
    return NextResponse.json(farmerProducts);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch products, error: ${error}` },
      { status: 500 }
    );
  }
}