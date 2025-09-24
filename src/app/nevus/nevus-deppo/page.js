// src/app/nevus/nevus-deppo/page.js
"use client";
import { useEffect, useState } from "react";
import Header from "@/components/NevusHeader";
import Sidebar from "@/components/admin/Sidebar";
import Search from "@/components/Search";
import HoverCard from '@/components/HoverCard';
import HamsterLoading from "@/components/HamsterLoading";

export default function DeppoPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ---------------------------- SEARCH
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // ----------------------------

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/nevus/nevus-deppo");
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

  // Sidebar açıkken body'e overflow hidden ekle ve scroll'u engelle
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Özelleştirilmiş HoverCard bileşeni
// ProductHoverCard bileşenini şu şekilde güncelleyin:
// ProductHoverCard bileşenini şu şekilde güncelleyin:
const ProductHoverCard = ({ product }) => {
  return (
    <div className="h-full w-full">
      <HoverCard href={`/nevus/nevus-deppo/${product.id}`}>
        <div className="absolute inset-0 flex flex-col justify-between p-4 z-30">
          {/* Görsel */}
          {product.image && (
            <div className="flex justify-center items-center h-32">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Başlık + Fiyat */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xl font-bold text-white">{product.price}</p>
          </div>

          {/* Butonu kaldırın veya değiştirin */}
          <div className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors mt-3 opacity-0">
            Ürünü Gör
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>
      </HoverCard>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-background dark:text-foreground relative">
      {/* Sidebar açıkken arka plan karartma efekti */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <Header />

      {/* Search */}
      <div className="flex justify-center mt-6">
        <Search onSearch={setSearchTerm} placeholder="Ürünlerde ara..." />
      </div>



{/* Sayfa İçeriği */}
<div className="p-6">
  <div className="max-w-7xl mx-auto">
<div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
    Nevus Deppo Ürünleri
  </h1>
      {!loading && !error && (
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {filteredProducts.length} ürün bulundu
        </span>
      )}
    </div>

 {loading ? (
   <div className="flex flex-col items-center justify-center h-64 space-y-6">
     {/* HamsterLoading */}
     <HamsterLoading />
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
) : filteredProducts.length > 0 ? (
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {filteredProducts.map((product, index) => (
          <div key={index} className="h-80">
            <ProductHoverCard product={product} />
          </div>
        ))}
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

