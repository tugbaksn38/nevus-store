// src/components/NevusHeader.js
// src/components/NevusHeader.js
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Sepet from './Sepet';
import Sidebar from './admin/Sidebar';

export default function NevusHeader({ onSearch }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // localStorage'dan sepeti dinle
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCart = JSON.parse(localStorage.getItem("nevusCart")) || [];
      setCart(storedCart);
    };

    // İlk yükleme
    handleStorageChange();

    // Storage event'ini dinle
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event'i dinle
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const categories = [
    { name: "Anasayfa", path: "/nevus/genc" },
    { name: "Oturma Odası", path: "/nevus/oturma" },
    { name: "Yatak Odası", path: "/nevus/yatak-odasi" },
    { name: "Nevus Deppo", path: "/nevus/nevus-deppo" },
    { name: "Ev Tekstili", path: "/nevus/ev-tekstili" },
    { name: "Yemek Odası", path: "/nevus/yemek-odasi" },
    { name: "Dekorasyon", path: "/nevus/dekorasyon" }
  ];

  // Sepetten ürün kaldırma
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("nevusCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Sepet miktarını güncelleme
  const updateCartItemQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem("nevusCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <>
      {/* Sidebar - Header'ın üstünde sabit */}
{/* Sidebar - Header'ın üstünde sabit */}
<div className="fixed top-0 left-0 z-50 h-16 flex items-center bg-[#c2a3a1] w-full">
  <button
    onClick={() => setIsSidebarOpen(true)}
    className="m-2 p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
  >
    ☰ Menü
  </button>
</div>
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Header - Mobilde genişleyen */}
      <header className="bg-[#c2a3a1] shadow-md relative z-30 mt-15">
        <div className="w-full px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center min-h-16 py-2">
            {/* Logo - Üstte veya yanda */}
            <div className="flex-shrink-0 mb-2 sm:mb-0">
              <h1 className="text-xl md:text-2xl font-bold text-[#faf3f2] text-center sm:text-left">NEVUS</h1>
            </div>
            
            {/* Kategori Navigasyonu - Mobilde çok satırlı */}
            <nav className="w-full sm:flex-1">
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-4">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={category.path}
                    className="text-[#faf3f2] font-bold hover:text-blue-600 px-2 py-1 rounded-md text-xs sm:text-sm whitespace-nowrap transition-colors border border-[#a88c8a]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Sağ tarafta Sepet ikonu - Mobilde aşağıda veya yanda */}
            <div className="flex items-center justify-center mt-2 sm:mt-0 sm:ml-4">
              <button 
                className="relative text-[#faf3f2] hover:text-blue-600 focus:outline-none"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sepet Componenti */}
        <Sepet 
          isOpen={isCartOpen} 
          setIsOpen={setIsCartOpen} 
          cart={cart} 
          removeFromCart={removeFromCart}
          updateCartItemQuantity={updateCartItemQuantity}
        />
      </header>
    </>
  );
}