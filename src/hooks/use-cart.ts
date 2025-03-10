import { useCartStore } from "@/store/useCartStore";
import { useCallback } from "react";

export const useCart = () => {
    const { cart, addToCart, removeFromCart, updateQuantity, clearCart, initializeCart } = useCartStore();

    const addItemToCart = useCallback(async (product: any) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'ADD_ITEM',
                    productId: product.productId,
                    quantity: product.quantity || 1
                }),
            });

            if (!response.ok) throw new Error('Failed to add item to cart');
            
            const updatedCart = await response.json();
            initializeCart(updatedCart);
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            throw error;
        }
    }, [initializeCart]);

    const removeItemFromCart = useCallback(async (productId: string) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'REMOVE_ITEM',
                    productId
                }),
            });

            if (!response.ok) throw new Error('Failed to remove item from cart');
            
            const updatedCart = await response.json();
            initializeCart(updatedCart);
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
            throw error;
        }
    }, [initializeCart]);

    const updateItemQuantity = useCallback(async (productId: string, quantity: number) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'UPDATE_QUANTITY',
                    productId,
                    quantity
                }),
            });

            if (!response.ok) throw new Error('Failed to update cart quantity');
            
            const updatedCart = await response.json();
            initializeCart(updatedCart);
        } catch (error) {
            console.error('Failed to update cart quantity:', error);
            throw error;
        }
    }, [initializeCart]);

    return {
        cart,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        initializeCart
    };
};