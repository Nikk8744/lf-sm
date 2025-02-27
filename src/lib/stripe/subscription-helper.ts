import { stripe } from "../stripe";

export async function createStripeProduct(name: string, description?: string) {
    return await stripe.products.create({
        name,
        description,
        type: "service",
    });
}

export async function createStripePrice(
    productId: string,
    price: number,
    interval: "day" | "week" | "month" | "year"
) {
    return await stripe.prices.create({
        product: productId,
        unit_amount: price * 100,
        currency: "usd",
        recurring: { 
            interval,
            interval_count: 1,
         },
    });
}

export async function deactivateStripePrice(priceId: string) {
    return await stripe.prices.update(priceId, {
        active: false,
    });
}

export function convertIntervalToStripe(
    interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
) {
    const intervalMap = {
        'DAILY': 'day',
        'WEEKLY': 'week',
        'MONTHLY': 'month',
        'YEARLY': 'year'
    } as const;
    
    return intervalMap[interval];
}