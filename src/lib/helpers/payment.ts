import Stripe from "stripe";

export function validatePaymentIntent(paymentIntent: Stripe.PaymentIntent) {
    const requiredFields = {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        metadata: {
            itemsJson: paymentIntent.metadata.itemsJson,
            shippingAddress: paymentIntent.metadata.shippingAddress,
            userId: paymentIntent.metadata.userId,
        },
        payment_methods_types: paymentIntent.payment_method_types,
    };

    for(const [key, value] of Object.entries(requiredFields)){
        if(!value){
            throw new Error(`Missing required field: ${key}`);
        }
    }

    try {
        JSON.parse(paymentIntent.metadata.itemsJson);
    } catch (error) {
        throw new Error('Invalid itemsJson format in metadata', error as Error)
    }
}