// Sepete ekleyi çıkarmak için bunu bir de service sil yeter.
// src/hooks/useCart.js
// src/hooks/useCart.js
"use client";
import { useState, useEffect } from 'react';

export function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('nevusCart')) || [];
    setCart(storedCart);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('nevusCart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    saveCart(newCart);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity
  };
}