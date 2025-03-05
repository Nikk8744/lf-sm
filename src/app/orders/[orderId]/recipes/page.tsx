import { db } from "@/database/drizzle";
import { orders, orderItems, products } from "@/database/schema";
import { eq } from "drizzle-orm";
import { ChatInterface } from "@/components/recipe-chat/chat-interface";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RecipePage({
  params
}: {
  params: { orderId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { orderId } = await Promise.resolve(params);

  // Fetch order items
  const orderWithItems = await db
    .select({
      id: orders.id,
      items: {
        name: products.name,
        quantity: orderItems.quantity,
      },
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(orderItems.productId, products.id));

  if (!orderWithItems.length) {
    notFound();
  }

  const items = orderWithItems.map((row) => row.items);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Recipe Suggestions</h1>
      <ChatInterface orderItems={items} />
    </div>
  );
}