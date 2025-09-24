"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import ApiHeader from "@/components/ApiHeader";
import Sepet from "@/components/AnaSepet";
import Sidebar from "@/components/admin/Sidebar";
import { useFoodFacts } from "@/hooks/useFoodFacts";

// Her ürün için ayrı bir bileşen oluşturalım
const ProductItem = ({ product, addToCart }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 500);
  };

  return (
    <div className="border rounded p-2 flex flex-col items-center relative">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.product_name}
          className="w-24 h-24 object-contain mb-2"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 mb-2 flex items-center justify-center text-gray-500 text-xs">
          Resim Yok
        </div>
      )}
      <span className="text-center text-sm font-medium mb-2">
        {product.product_name || "İsimsiz Ürün"}
      </span>

      <button
        onClick={handleAdd}
        className={`mt-auto px-3 py-1 rounded text-sm font-medium transition-all duration-300
          ${added 
            ? "bg-green-500 text-white transform -translate-y-1 shadow-lg" 
            : "bg-[#b69243] text-white hover:bg-[#a5823a]"
          }`}
      >
        {added ? "Sepete Eklendi" : "Sepete Ekle"}
      </button>
    </div>
  );
};

export default function FoodFactsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const { products, total, loading, error } = useFoodFacts(page, 20);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.code);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.code 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.code,
        title: product.product_name || "İsimsiz Ürün",
        price: 10,
        quantity: 1,
        image: product.image_url
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative min-h-screen">
      <ApiHeader
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <Sepet
        isOpen={isCartOpen} 
        setIsOpen={setIsCartOpen}
        cart={cart}
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
      />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold">Food Facts Ürünler</h1>
        </div>

        {loading && <p>Yükleniyor...</p>}
        {error && <p>Hata oluştu</p>}

        {/* Responsive grid yapısı eklendi */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductItem key={p.code} product={p} addToCart={addToCart} />
          ))}
        </div>

        <div className="flex gap-2 mt-6 justify-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Önceki
          </button>
          <span className="flex items-center">Sayfa {page}</span>
          <button
            disabled={page * 20 >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
}