// src/app/page.js
/* components/DummyCard.css buraya bağlı cardlar burada */
// src/app/page.js
/* components/DummyCard.css buraya bağlı cardlar burada */
"use client";

import { useState } from "react"; 
import { useRouter } from "next/navigation";

import Sepet from "@/components/AnaSepet";
import Sidebar from "@/components/admin/Sidebar";
import CategoryFilter from "@/components/CategoryFilter";
import AnimatedProductList from "@/components/AnimatedProductList";

import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts"; 
import ApiHeader from "@/components/ApiHeader";

export default function Home() {
  const router = useRouter(); 

  const [isOpen, setIsOpen] = useState(false); // Sidebar
  const [isCartOpen, setIsCartOpen] = useState(false); // Sepet paneli

  // useCart hook'unu güncellenmiş haliyle kullan
  const { cart, addToCart, removeFromCart, updateCartItemQuantity } = useCart();

  const [searchTerm, setSearchTerm] = useState(""); 
  const [categorySlug, setCategorySlug] = useState(null); 
  const [page, setPage] = useState(1); 
  const [sortBy, setSortBy] = useState(""); // yeni state

  const { products, loading, total } = useProducts({
    searchTerm,
    categorySlug,
    page,
    limit: 12,
    sortBy, // buraya ekledik
  });

  return (
    <div className="relative min-h-screen">
      {/* --------------------------------------------------------------
          HEADER (ORTAK API HEADER)
      -------------------------------------------------------------- */}
      <ApiHeader
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* --------------------------------------------------------------
          MENÜ BUTONU
      -------------------------------------------------------------- */}
    

      {/* --------------------------------------------------------------
          YAN MENÜ (SIDEBAR)
      -------------------------------------------------------------- */}
      <Sidebar 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* --------------------------------------------------------------
          ANA İÇERİK
      -------------------------------------------------------------- */}
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Ana Sayfaya Hoş Geldiniz!</h1>

        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded w-full mb-4"
        />

        <CategoryFilter
          onSelect={(slug) => {
            setCategorySlug(slug);
            setPage(1);
          }}
        />

        <div className="mb-4">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded w-full md:w-60"
          >
            <option value="">Sıralama Seçin</option>
            <option value="price_asc">Fiyata Göre (Artan)</option>
            <option value="price_desc">Fiyata Göre (Azalan)</option>
            <option value="name_asc">İsme Göre (A-Z)</option>
            <option value="name_desc">İsme Göre (Z-A)</option>
            <option value="latest">En Yeni</option>
          </select>
        </div>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          // Ana sayfada AnimatedProductList bileşenini kullandığınız kısmı güncelleyin:
          <AnimatedProductList 
            products={products} 
            addToCart={addToCart}
            removeFromCart={removeFromCart} // Yeni prop eklendi
            cart={cart} // Yeni prop eklendi
          />
        )}

        <div className="flex gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Önceki
          </button>
          <span>Sayfa {page}</span> 
          <button
            disabled={page * 12 >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------
          SEPET PANELİ
      -------------------------------------------------------------- */}
      <Sepet 
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
      />
    </div>
  );
}