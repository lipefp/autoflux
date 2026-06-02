import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Part } from '@/data/mockParts';

export interface CartItem {
  part: Part;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (part: Part, quantity: number) => void;
  removeFromCart: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(part: Part, quantity: number) {
    setItems((prev) => {
      const existing = prev.find((i) => i.part.id === part.id);
      if (existing) {
        return prev.map((i) =>
          i.part.id === part.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { part, quantity }];
    });
  }

  function removeFromCart(partId: string) {
    setItems((prev) => prev.filter((i) => i.part.id !== partId));
  }

  function updateQuantity(partId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.part.id === partId ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.part.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
