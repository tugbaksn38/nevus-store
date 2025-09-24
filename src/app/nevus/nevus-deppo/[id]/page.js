// src/app/nevus/nevus-deppo/[id]/page.js
// src/app/nevus/nevus-deppo/[id]/page.js

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/NevusHeader";
import Sidebar from "@/components/admin/Sidebar";
import AnimatedButton from "@/components/AnimatedButton";
import LikeButton from "@/components/LikeButton";
import JumpLoader from "@/components/JumpLoader";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Favorileri localStorage'dan yükle
  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem("nevusFavorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Favori durumunu güncelle
  const toggleFavorite = () => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(updatedFavorites);
    localStorage.setItem("nevusFavorites", JSON.stringify(updatedFavorites));
  };

  // Ürün detaylarını getir
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/nevus/nevus-deppo");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        const foundProduct = data.products.find((p) => p.id === productId);
        if (!foundProduct) throw new Error("Ürün bulunamadı");

        setProduct(foundProduct);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Fiyatı number'a çevirme fonksiyonu (Sepet için)
  const parsePrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;

    let cleanedPrice = price
      .toString()
      .replace("TL", "")
      .replace("₺", "")
      .replace(/\./g, "") // Binlik ayırıcıları kaldır
      .replace(",", ".") // Ondalık ayırıcıyı noktaya çevir
      .trim();

    return parseFloat(cleanedPrice) || 0;
  };

  // Sepete ekle fonksiyonu
  const addToCart = (product) => {
    if (!product) return;

    // Hem orijinal fiyat formatını hem de sayısal değeri sakla
    const productForCart = {
      ...product,
      displayPrice: product.price, // Orijinal format: "43.597,00 TL"
      numericPrice: parsePrice(product.price), // Sayısal değer: 43597.00
    };

    const storedCart = JSON.parse(localStorage.getItem("nevusCart")) || [];
    const existingItem = storedCart.find(
      (item) => item.id === productForCart.id
    );

    let updatedCart;
    if (existingItem) {
      updatedCart = storedCart.map((item) =>
        item.id === productForCart.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...storedCart,
        {
          ...productForCart,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("nevusCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const isFavorite = favorites.includes(productId);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-background dark:text-foreground">
      {/* Header artık localStorage'dan sepeti okuyor */}
      <Header />



      {/* Sayfa İçeriği */}
      <div className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-6">
            <JumpLoader />
            <p className="text-gray-600 dark:text-gray-300">
              Ürün yükleniyor...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800">
              Hata: {error}
            </h2>
            <AnimatedButton
              href="/nevus/nevus-deppo"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ürünlere Dön
            </AnimatedButton>
          </div>
        ) : product ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Ürün Görseli */}
              <div className="relative">
                <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <LikeButton
                    isActive={isFavorite}
                    onClick={toggleFavorite}
                    size="lg"
                  />
                </div>
              </div>

              {/* Ürün Bilgileri */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-2xl text-blue-600">{product.price}</p>

                {/* Ürün ID'sini gösteren küçük yazı */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ürün ID: {productId}
                </p>

                <div className="flex space-x-4">
                  {/* Sepete ekle butonu */}
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    🛒 Sepete Ekle
                  </button>
                </div>

                <AnimatedButton
                  href="/nevus/nevus-deppo"
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                >
                  ← Tüm Ürünlere Dön
                </AnimatedButton>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
