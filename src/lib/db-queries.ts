import { cache } from 'react';
import { db } from '@/database/drizzle';
import { desc, eq } from 'drizzle-orm';
import { products } from '@/database/schema';

export const getProductWithCache = cache(async (productId: string) => {
    return await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .then((res) => res[0] || null);
});

export const getHotProducts = cache(async () => {
    return await db
        .select()
        .from(products)
        .orderBy(desc(products.createdAt))
        .limit(10);
});