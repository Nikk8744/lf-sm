import { db } from "@/database/drizzle";
import { orderItems, orders, products } from "@/database/schema";
import { authOptions } from "@/lib/auth";
import { NotificationServices } from "@/lib/notifications";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  // context: { params: { orderId: string } },
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const { orderId } = await params;
    // const orderId = context.params.orderId;
    // Await the context to get the params before using them
    // const { params } = await Promise.resolve(context);
    // const { orderId } = await params;
    const { orderId } = await context.params;

    // const order = await db.select().from(orders).where(eq(orders.id, params.orderId));
    const order = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)));

    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        totalPrice: orderItems.totalPrice,
        createdAt: orderItems.createdAt,
        // Join with products to get product details
        productName: products.name,
        productImage: products.image,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .leftJoin(products, eq(orderItems.productId, products.id));

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderWithItems = {
      ...order[0],
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        image: item.productImage,
        createdAt: item.createdAt,
      })),
    };

    // return NextResponse.json(order, {status: 200})
    return NextResponse.json(orderWithItems, { status: 200 });
  } catch (error) {
    console.log("Error fetching order", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  //   { params }: { params: { orderId: string } }
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { status } = await request.json();

    // const { orderId } = await params;
    // const orderId = params.orderId;
    const { orderId } = await context.params;

    const order = await db
      .update(orders)
      .set({ orderStatus: status })
      .where(eq(orders.id, orderId))
      .returning();

    // Send notification to user
    await NotificationServices.orderStatus(
      order[0].userId,
      order[0].id,
      status
    );

    return NextResponse.json(order[0]);
  } catch (error) {
    // Error handling
    return NextResponse.json(
      { error: `Failed to send the status notification, ${error}` },
      { status: 500 }
    );
  }
}
