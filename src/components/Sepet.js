// src/components/Sepet.js
// src/components/Sepet.js
"use client";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sepet({ isOpen, setIsOpen, cart, removeFromCart, updateCartItemQuantity }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimateItems(true);
      const timer = setTimeout(() => setAnimateItems(false), 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, cart]);

  // Fiyatı number'a çevirme fonksiyonu
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    
    let cleanedPrice = price
      .replace('TL', '')
      .replace('₺', '')
      .replace(/\./g, '') // Binlik ayırıcıları kaldır
      .replace(',', '.') // Ondalık ayırıcıyı noktaya çevir
      .trim();
    
    return parseFloat(cleanedPrice) || 0;
  };

  // Fiyatı formatlama fonksiyonu
  const formatPrice = (price) => {
    const numericPrice = parsePrice(price);
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericPrice);
  };

  // Toplam hesaplama
  const total = cart.reduce((acc, item) => {
    const price = parsePrice(item.price);
    return acc + (price * item.quantity);
  }, 0);

  // Tekil ürün toplamını hesaplama
  const calculateItemTotal = (item) => {
    const price = parsePrice(item.price);
    return price * item.quantity;
  };

  if (!isOpen && !isVisible) return null;

  return (
    <>
      {/* Arka plan overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sepet paneli */}
      <div className={`fixed top-0 right-0 w-80 md:w-96 h-full bg-gradient-to-b from-blue-50 to-indigo-100 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Başlık alanı */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center border-b border-indigo-700 shadow-sm">
          <div className="flex items-center">
            <ShoppingCart className="text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Sepetim</h2>
            {cart.length > 0 && (
              <span className="ml-2 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          
          {/* Kapatma butonu */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-pink-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sepet içerik */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-indigo-700 opacity-80">
              <ShoppingCart size={48} className="mb-4 opacity-70" />
              <p className="text-center text-lg">Sepetiniz boş</p>
              <p className="text-sm mt-2 text-center">Hemen alışverişe başlayın!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map((item, index) => {
                const itemTotal = calculateItemTotal(item);

                return (
                  <li
                    key={`${item.id}-${index}`}
                    className={`bg-white rounded-lg p-3 text-gray-800 flex justify-between items-center border border-indigo-100 shadow-sm transform transition-all duration-300 ${
                      animateItems ? "scale-105 shadow-md" : "scale-100"
                    }`}
                  >
                    <div className="flex-1">
                      <span className="font-medium block text-indigo-900">{item.name || item.title}</span>
                      <div className="flex items-center mt-2">
                        {/* Miktar azaltma butonu */}
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                        {/* Miktar artırma butonu */}
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                        <span className="ml-3 text-sm text-gray-600">
                          x ₺{formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold mr-3 text-indigo-800">₺{formatPrice(itemTotal)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-indigo-600 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                        title="Ürünü kaldır"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Toplam ve ödeme butonu */}
        {cart.length > 0 && (
          <div className="bg-white p-4 border-t border-indigo-200 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-700">Toplam:</span>
              <span className="text-xl font-bold text-indigo-800">₺{formatPrice(total)}</span>
            </div>
            
            <button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
              onClick={() => alert('Ödeme işlemi başlatılıyor...')}
            >
              Ödeme Yap
            </button>
          </div>
        )}
      </div>
    </>
  );
}