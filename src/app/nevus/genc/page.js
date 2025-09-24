// src/app/nevus/genc/page.js
// src/app/nevus/genc/page.js

"use client";
import { useEffect, useState } from "react";
import Header from "@/components/NevusHeader";
import Sidebar from "@/components/admin/Sidebar";
import Search from "@/components/Search";
import AnimatedButton from '@/components/AnimatedButton';
import LikeButton from '@/components/LikeButton';
import JumpLoader from "@/components/JumpLoader";

export default function GencPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState([]); // Favori state'i
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  
  // Favorileri localStorage'dan yükle
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('nevusFavorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  // Favori durumunu güncelle
  const toggleFavorite = (productId) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('nevusFavorites', JSON.stringify(updatedFavorites));
  };

  // Filtrelenmiş ve sıralanmış ürünler
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sıralama işlemi
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceToNumber = (priceStr) => {
      return parseFloat(
        priceStr
          .replace('TL', '')
          .replace('.', '')
          .replace(',', '.')
          .trim()
      );
    };
    
    switch(sortOption) {
      case "price-asc":
        return priceToNumber(a.price) - priceToNumber(b.price);
      case "price-desc":
        return priceToNumber(b.price) - priceToNumber(a.price);
      case "name-asc":
        return a.name.localeCompare(b.name, 'tr');
      case "name-desc":
        return b.name.localeCompare(a.name, 'tr');
      default:
        return 0;
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/nevus/genc");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-background dark:text-foreground">

      {/* Header */}
      <Header />

      {/* Arama, Sıralama ve Favoriler Butonu */}
      <div className="flex flex-col md:flex-row justify-center items-center mt-6 px-4 space-y-4 md:space-y-0 md:space-x-4">
        {/* Arama */}
        <div className="w-full md:w-auto">
          <Search onSearch={setSearchTerm} placeholder="Ürünlerde ara..." />
        </div>
        
{/* Sıralama Seçeneği */}
<div className="w-full md:w-auto flex justify-end">
  <div className="flex items-center space-x-2">
    <label 
      htmlFor="sort" 
      className="text-sm text-gray-900 dark:text-white whitespace-nowrap"
    >
      Sırala:
    </label>
    <select
      id="sort"
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      className="p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white dark:text-white dark:bg-gray-700"
    >
      <option value="default">Varsayılan</option>
      <option value="price-asc">Fiyat (Artan)</option>
      <option value="price-desc">Fiyat (Azalan)</option>
      <option value="name-asc">İsim (A-Z)</option>
      <option value="name-desc">İsim (Z-A)</option>
    </select>
  </div>
</div>

        
        {/* Favoriler Butonu */}
        <div className="w-full md:w-auto">
          <AnimatedButton 
            href="/nevus/favoriler"
            className="w-full md:w-auto text-center justify-center py-2 bg-pink-500 hover:bg-pink-600"
          >
            Favorilerim
          </AnimatedButton>
        </div>
      </div>



      {/* Sayfa İçeriği */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Nevus Ürünleri</h1>
          {!loading && !error && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {sortedProducts.length} ürün bulundu
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-6">
            <JumpLoader />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-semibold text-red-800">Hata Oluştu</h2>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => {
              // Benzersiz bir ID oluştur (link + name kombinasyonu)
              const productId = `${product.link}-${product.name}`.replace(/\s+/g, '-');
              const isFavorite = favorites.includes(productId);
              
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col relative"
                >
                  {/* Like Button */}
                  <div className="absolute top-2 right-2 z-10">
                    <LikeButton 
                      isActive={isFavorite} 
                      onClick={() => toggleFavorite(productId)}
                    />
                  </div>
                  
                  {product.image && (
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center bg-gray-200">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h2>
                    <p className="text-2xl font-bold text-blue-600 mb-3">{product.price}</p>
                    
                    <div className="mt-auto">
                      {product.link && (
// Ana sayfadaki ürün kartı içinde:
<AnimatedButton 
  href={`/nevus/genc/${product.id}`} // ID'ye göre link
  className="w-full text-center justify-center py-2"
>
  Ürün Detayları
</AnimatedButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Ürün bulunamadı</h3>
            <p className="text-gray-500">Lütfen daha sonra tekrar deneyin.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}