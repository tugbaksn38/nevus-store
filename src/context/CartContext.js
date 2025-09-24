// src/context/CartContext.js
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Sayfa yüklendiğinde localStorage'dan sepeti yükle
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("nevusCart")) || [];
    setCart(storedCart);
  }, []);

  // Sepet değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("nevusCart", JSON.stringify(cart));
  }, [cart]);

  // Sepete ürün ekle
  const addToCart = (product) => {
    setCart(prevCart => {
      // Ürün zaten sepette var mı kontrol et
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Var olan ürünün miktarını artır
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Yeni ürün ekle
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Sepetten ürün kaldır
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Sepeti temizle
  const clearCart = () => {
    setCart([]);
  };

  // Toplam fiyatı hesapla
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Toplam ürün sayısını hesapla
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}