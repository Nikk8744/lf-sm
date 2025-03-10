import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    farmLocation: string;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    updateQuantity: (productId: string, quantity: number) => void;
    initializeCart: (items: CartItem[]) => void;
}


export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: [],
            addToCart: (product) => set((state) => {
                const existingProduct = state.cart.find((item) => item.productId === product.productId);
                if (existingProduct) {
                    return {
                        cart: state.cart.map((item) =>
                            item.productId === product.productId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                }
                return { cart: [...state.cart, { ...product, quantity: 1 }] };
            }),
            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter((item) => item.productId !== productId),
            })),
            clearCart: () => set({ cart: [] }),
            updateQuantity: (productId, quantity) => set((state) => ({
                cart: state.cart.map((item) => item.productId === productId ? { ...item, quantity } : item)
            })),
            initializeCart: (items) => set({ cart: items }),
        }),
        {
            name: 'cart-storage',
            // storage: createJSONStorage(() => localStorage)
            storage: createJSONStorage(() => typeof window !== 'undefined' ? window.localStorage : undefinedq),
            
        }
    )
);


