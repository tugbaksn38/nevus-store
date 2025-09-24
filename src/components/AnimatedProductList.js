// components/AnimatedProductList.js
"use client";

import { useState, useEffect } from "react";
import "./DummyCard.css";

export default function AnimatedProductList({ products, title = "5. Bölüm - Ürünler", addToCart, removeFromCart, cart }) {
  const [recentlyAdded, setRecentlyAdded] = useState({});
  
  if (!products || products.length === 0) {
    return <div className="text-center py-8">Ürün bulunamadı</div>;
  }

  const handleAddToCart = (product) => {
    // Sepetteki mevcut miktarı kontrol et
    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    // 10 adet sınırını kontrol et
    if (currentQuantity >= 10) {
      alert("Bir üründen en fazla 10 adet sepete ekleyebilirsiniz.");
      return;
    }
    
    addToCart(product);
    
    // Ürünün sepete eklendiğini belirt ve 2.5 saniye sonra kaldır
    setRecentlyAdded(prev => ({
      ...prev,
      [product.id]: true
    }));
    
    setTimeout(() => {
      setRecentlyAdded(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 500);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map(product => {
          const isInCart = cart.some(item => item.id === product.id);
          const justAdded = recentlyAdded[product.id];
          const cartItem = cart.find(item => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          
          return (
            <div key={product.id} className="card">
              <div className="main-content">
                <div className="header">
                  <span>Kategori:</span>
                  <span>{product.category}</span>
                </div>
                
                <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-md mb-3">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                
                <p className="heading line-clamp-2">{product.title}</p>
                
                <div className="categories">
                  <span>${product.price}</span>
                </div>
              </div>
              
              <div className="footer">
                {justAdded ? (
                  <div className="w-full py-2 bg-green-600 text-white text-center rounded transition-all duration-300 ease-in-out">
                    Sepete Eklendi ✓
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={quantity >= 10}
                    className={`w-full py-2 rounded transition-all duration-300 ease-in-out ${
                      quantity >= 10
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {quantity >= 10 ? 'Maksimum adet' : 'Sepete Ekle'}
                  </button>
                )}
              </div>
              
              {quantity > 0 && (
                <div className="mt-2 text-center text-sm text-blue-600 font-medium">
                  Sepette: {quantity} adet
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}