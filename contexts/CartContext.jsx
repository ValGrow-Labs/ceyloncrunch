'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ceylon_crunch_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('ceylon_crunch_cart', JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length === 0 ? 0 : subtotal >= 5000 ? 0 : 450;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{ items, setItems, isDrawerOpen, setIsDrawerOpen, subtotal, deliveryFee, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
