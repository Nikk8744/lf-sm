'use client';
import { create } from 'zustand';

interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  farmLocation: string;
}

interface DirectPurchaseStore {
  product: Product | null;
  setProduct: (product: Product) => void;
  clearProduct: () => void;
}

export const useDirectPurchaseStore = create<DirectPurchaseStore>((set) => ({
  product: null,
  setProduct: (product) => {
    console.log('Setting product in store:', product); // Log to confirm
    set({ product });
  },
  clearProduct: () => set({ product: null }),
}));
