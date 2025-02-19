import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { products } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {

    const { params } = await Promise.resolve(context);
    const { id } = await params;

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((res) => res[0] || null);

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }
    console.log("The product is",product);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}