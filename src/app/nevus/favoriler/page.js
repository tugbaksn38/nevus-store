// src/app/nevus/favoriler/page.js
// src/app/nevus/favoriler/page.js
"use client";
import { useEffect, useState } from "react";
import Header from "@/components/NevusHeader";
import Sidebar from "@/components/admin/Sidebar";
import Search from "@/components/Search";
import AnimatedButton from "@/components/AnimatedButton";
import LikeButton from "@/components/LikeButton";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  // Favorileri localStorage'dan yükle
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("nevusFavorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  // Tüm ürünleri API'den çek
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        const endpoints = [
          { url: "/api/nevus/yatak-odasi", category: "Yatak Odası" },
          { url: "/api/nevus/dekorasyon", category: "Dekorasyon" },
          { url: "/api/nevus/oturma", category: "Oturma Odası" },
          { url: "/api/nevus/nevus-deppo", category: "Nevus Deppo" },
          { url: "/api/nevus/ev-tekstili", category: "Ev Tekstili" },
          { url: "/api/nevus/yemek-odasi", category: "Yemek Odası" },
          { url: "/api/nevus/genc", category: "Anasayfa" },
        ];

        const responses = await Promise.all(
          endpoints.map((ep) => fetch(ep.url))
        );

        for (const response of responses) {
          if (!response.ok)
            throw new Error(`API error! status: ${response.status}`);
        }

        const dataArr = await Promise.all(responses.map((res) => res.json()));

        let allProducts = [];
        dataArr.forEach((data, idx) => {
          const category = endpoints[idx].category;
          if (data.products && Array.isArray(data.products)) {
            allProducts = allProducts.concat(
              data.products.map((p) => ({
                ...p,
                category,
                id: `${p.link || ""}-${p.name || ""}`.replace(/\s+/g, "-"),
              }))
            );
          }
        });

        setProducts(allProducts);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Favori ekle / çıkar
  const toggleFavorite = (productId) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(updatedFavorites);
    localStorage.setItem("nevusFavorites", JSON.stringify(updatedFavorites));
  };

  // Favori ürünleri filtrele
  const favoriteProducts = products.filter((product) => {
    return favorites.includes(product.id);
  });

  // Arama ve sıralama
  const filteredProducts = favoriteProducts.filter(
    (product) =>
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceToNumber = (priceStr) =>
      parseFloat(
        (priceStr || "0")
          .replace("TL", "")
          .replace(".", "")
          .replace(",", ".")
          .trim()
      );

    switch (sortOption) {
      case "price-asc":
        return priceToNumber(a.price) - priceToNumber(b.price);
      case "price-desc":
        return priceToNumber(b.price) - priceToNumber(a.price);
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "", "tr");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "", "tr");
      case "category-asc":
        return (a.category || "").localeCompare(b.category || "", "tr");
      case "category-desc":
        return (b.category || "").localeCompare(a.category || "", "tr");
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-background dark:text-foreground">
      <Header />

      {/* Arama ve Sıralama */}
      <div className="flex flex-col md:flex-row justify-center items-center mt-6 px-4 space-y-4 md:space-y-0 md:space-x-4">
        <Search onSearch={setSearchTerm} placeholder="Favorilerde ara..." />
        <div className="w-full md:w-auto flex justify-end">
          <label className="text-sm text-gray-900 dark:text-white mr-2">
            Sırala:
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="default">Varsayılan</option>
            <option value="price-asc">Fiyat (Artan)</option>
            <option value="price-desc">Fiyat (Azalan)</option>
            <option value="name-asc">İsim (A-Z)</option>
            <option value="name-desc">İsim (Z-A)</option>
          </select>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Favori Ürünlerim
          </h1>
          {!loading && !error && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {sortedProducts.length} favori ürün
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Tekrar Dene
            </button>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => {
              const isFavorite = favorites.includes(product.id);

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col relative min-h-[400px]"
                >
                  {/* Like Button */}
                  <div className="absolute top-2 right-2 z-10">
                    <LikeButton
                      isActive={isFavorite}
                      onClick={() => toggleFavorite(product.id)}
                    />
                  </div>

                  {/* Kategori Etiketi */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {product.category || "Bilinmiyor"}
                    </span>
                  </div>

                  {/* Resim */}
                  {product.image ? (
                    <div className="h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name || "Ürün"}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Resim yok</span>
                    </div>
                  )}

                  {/* Ürün Bilgisi */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.name || "İsim yok"}
                    </h2>
                    <p className="text-2xl font-bold text-blue-600 mb-3">
                      {product.price || "-"}
                    </p>
                    {product.id && (
                      <Link
                        href={`/nevus/favoriler/${encodeURIComponent(
                          product.id
                        )}`}
                        className="w-full"
                      >
                        <AnimatedButton className="w-full text-center py-2">
                          Ürün Detayları
                        </AnimatedButton>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Henüz favori ürününüz yok
            </h3>
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
