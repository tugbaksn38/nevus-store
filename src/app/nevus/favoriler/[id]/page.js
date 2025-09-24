// src/app/nevus/favoriler/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/NevusHeader";
import AnimatedButton from "@/components/AnimatedButton";
import LikeButton from "@/components/LikeButton";
import JumpLoader from "@/components/JumpLoader";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = decodeURIComponent(params.id); // URL encoded ID'yi decode et

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Favorileri localStorage'dan yükle
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("nevusFavorites")) || [];
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

  // Tüm ürünleri API'den çek - Optimize edilmiş versiyon
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        // Önce localStorage'dan favori ürünleri kontrol et
        const allFavorites = JSON.parse(localStorage.getItem("nevusFavorites") || "[]");
        
        // ID karşılaştırmasında decode edilmiş hali kullan
        const isFavorite = allFavorites.some(favId => 
          decodeURIComponent(favId) === productId
        );
        
        if (!isFavorite) {
          throw new Error("Bu ürün favorilerinizde bulunamadı");
        }

        // Tüm API endpoint'lerini deneyerek ürünü bul
        const endpoints = [
          { url: "/api/nevus/yatak-odasi", category: "Yatak Odası" },
          { url: "/api/nevus/dekorasyon", category: "Dekorasyon" },
          { url: "/api/nevus/oturma", category: "Oturma Odası" },
          { url: "/api/nevus/nevus-deppo", category: "Nevus Deppo" },
          { url: "/api/nevus/ev-tekstili", category: "Ev Tekstili" },
          { url: "/api/nevus/yemek-odasi", category: "Yemek Odası" },
          { url: "/api/nevus/genc", category: "Anasayfa" },
        ];

        let foundProduct = null;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint.url);
            if (!response.ok) continue;
            
            const data = await response.json();
            if (data.products && Array.isArray(data.products)) {
              // Tüm ürünler için ID'yi aynı şekilde oluştur
              const productsWithId = data.products.map(p => ({
                ...p,
                category: endpoint.category,
                id: `${p.link || ""}-${p.name || ""}`.replace(/\s+/g, "-")
              }));
              
              // ID karşılaştırmasında decode edilmiş hali kullan
              foundProduct = productsWithId.find(p => 
                decodeURIComponent(p.id) === productId
              );
              
              if (foundProduct) break;
            }
          } catch (err) {
            console.warn(`API hatası (${endpoint.category}):`, err);
            continue;
          }
        }

        if (!foundProduct) {
          throw new Error("Ürün bulunamadı");
        }

        setProduct(foundProduct);
        setError(null);
      } catch (err) {
        console.error("Ürün detay hatası:", err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
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
    
    // Kullanıcıyı bilgilendir
    alert("Ürün sepete eklendi!");
  };

  const isFavorite = favorites.some(favId => 
    decodeURIComponent(favId) === productId
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-background dark:text-foreground">
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
            <div className="mt-4 space-y-2">
              <Link href="/nevus/favoriler">
                <AnimatedButton className="bg-red-600 hover:bg-red-700 text-white">
                  Favorilere Dön
                </AnimatedButton>
              </Link>
              <button
                onClick={() => router.back()}
                className="ml-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Geri Dön
              </button>
            </div>
          </div>
        ) : product ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Ürün Görseli */}
              <div className="relative">
                <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                  ) : null}
                  <div className="hidden text-gray-400">Resim yok</div>
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
                
                {/* Kategori bilgisi */}
                {product.category && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Kategori: {product.category}
                  </p>
                )}
                
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

                <div className="flex space-x-2">
                  <Link href="/nevus/favoriler">
                    <AnimatedButton className="bg-gray-600 hover:bg-gray-700 text-white">
                      ← Favorilere Dön
                    </AnimatedButton>
                  </Link>
                  <button
                    onClick={() => router.back()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Geri Dön
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}