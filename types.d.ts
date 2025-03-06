interface AuthCredentials {
    name: string;
    email: string;
    password: string;
}


interface ProductCardProps {
    id: string
    name: string
    price: number
    description?: string
    imageUrl?: string
    farmLocation: string
    quantity: number
}


interface CheckoutProps {
    amount: number;
    purchaseType: 'direct' | 'cart';
    handlePaymentSuccess: () => void;
    handlePaymentFailure: (errorMessage?: string) => void;
    shippingAddress: string;
}

interface Order {
    id: string
    userId: string
    totalAmount: string
    shippingAddress: string
    paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED'
    paymentMethod: string
    paymentIntentId: string
    orderStatus: 'PENDING' | 'SHIPPED' | 'DELIVERED'
    createdAt: Date
    updatedAt: Date
    items: OrderItem[]
}

interface OrderItem {
    image?: string | StaticImport;
    name: string;
    id: string
    productId: string
    orderId: string
    quantity: number
    unitPrice: number
    totalPrice: number
    createdAt: string
    // name?: string
}
interface OrderItemForEmail {
    name: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    image?: string;
}
interface OrderConfirmationEmailProps {
    to?: string;
    orderNumber: string;
    customerName: string;
    orderItems: OrderItemForEmail[];
    totalAmount: string;
    shippingAddress: string;
    // paymentMethod: string;
    // paymentStatus: string;
    // orderStatus?: string;
    // orderDate?: string;
}

interface SendOrderConfirmationEmailParams {
    to: string;
    orderNumber: string;
    customerName: string;
    orderItems: {
        name: string;
        quantity: number;
        unitPrice: string;
        totalPrice: string;
    }[];
    totalAmount: string;
    shippingAddress: string;
}

interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
    userName: string;
}

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: string;
    interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    isActive: boolean;
    maxProducts: number;
    stripeProductId: string;
    stripePriceId: string;
}

export interface DeliverySchedule {
    preferredDay: string;
    preferredTime: string;
    address: string;
    instructions?: string;
}

export interface SubscriptionFormData {
    planId: string;
    deliverySchedule: DeliverySchedule;
}

interface SendSubscriptionConfirmationEmailParams {
    to: string;
    customerName: string;
    planName: string;
    price: string;
    interval: string;
    deliverySchedule: {
        preferredDay: string;
        preferredTime: string;
        address: string;
        instructions?: string;
    };
}

export type NotificationType = 
| 'ORDER_STATUS' 
| 'PAYMENT_STATUS'
| 'DELIVERY_UPDATE'
| 'SUBSCRIPTION_UPDATE'
| 'GENERAL';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    createdAt: string;
    isRead: boolean;
    userId: string;
}