interface AuthCredentials {
    // fullName: string;
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
    handlePaymentFailure: () => void;
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