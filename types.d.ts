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
  }