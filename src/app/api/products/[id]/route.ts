import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { products } from '@/database/schema';
import { and, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  // context: { params: { id: string } }
  context: { params: Promise<{ id: string }> }
) {
  try {

    // const { params } = await Promise.resolve(context);
    // const { id } = await params;
    const { id } = await context.params;


    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((res) => res[0] || null);

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }
    // console.log("The product is",product);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest, 
  // { params }: { params: { id: string } }
  context: { params: Promise<{ id: string }> }
) {
  try {
      const session = await getServerSession(authOptions);
      if (!session) {
          return new Response("Unauthorized", { status: 401 });
      }

      const farmerId = session.user.id;

      // const url = new URL(request.url);
      // const id = url.searchParams.get('id');
      // const { id } = await params;
      const { id } = await context.params;


      if (!id) {
          return NextResponse.json(
              { error: "Product ID is required" },
              { status: 400 }
          );
      }
    //   console.log("The id is",id)
      // console.log("The farmser id is",farmerId === products.farmerId)
      // console.log("The product id is",id === products.id)
      const existingProduct = await db
          .select({
              id: products.id,
              farmerId: products.farmerId
          })
          .from(products)
          .where(
              and(
                  eq(products.id, id),
                  eq(products.farmerId, farmerId)
              )
          ).limit(1);
      // console.log("The existing product is",existingProduct)
      if(!existingProduct || existingProduct.length === 0){
          return NextResponse.json(
              {error: "Product not found or you don't have permission to delete it"},
              {status: 404}
          )
      }

      const deltedProduct = await db.delete(products).where(
          and(
              eq(products.id, id),
              eq(products.farmerId, farmerId)
          )
      ).returning();

      return NextResponse.json({
          message: "Product deleted successfully",
          deletedProduct: deltedProduct,
      }, {status: 200})


  } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json({
          error: "Failed to delete product"
      }, { status: 500 });
  }
}