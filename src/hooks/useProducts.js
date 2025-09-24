// src/hooks/useProducts.js

// BÖLÜM 1: GEREKLİ IMPORTLAR
// ----------------------------------------------------------------------------------------
// React'in temel hook'larını import ediyoruz
// useEffect: Bileşenin yaşam döngüsünü yönetmek için
// useState: Bileşen içinde state (durum) yönetimi için
import { useEffect, useState } from "react";
import { fetchAllProducts, searchProducts, fetchProductsByCategory } from "@/services/products";

export function useProducts({ searchTerm, categorySlug, page = 1, limit = 12, sortBy = "" }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const skip = (page - 1) * limit;

      try {
  let data;

  if (searchTerm) data = await searchProducts(searchTerm, limit, skip);
  else if (categorySlug) data = await fetchProductsByCategory(categorySlug, limit, skip);
  else data = await fetchAllProducts(limit, skip);

  console.log("API Ürünleri:", data.products); // burayı kontrol et

  let sortedProducts = [...data.products];

  if (sortBy === "price_asc") sortedProducts.sort((a,b) => a.price - b.price);
  if (sortBy === "price_desc") sortedProducts.sort((a,b) => b.price - a.price);
  if (sortBy === "name_asc") sortedProducts.sort((a,b) => ((a.title||"")+ "").localeCompare((b.title||"")+ ""));
  if (sortBy === "name_desc") sortedProducts.sort((a,b) => ((b.title||"")+ "").localeCompare((a.title||"")+ ""));
  if (sortBy === "latest") sortedProducts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  setProducts(sortedProducts);
  setTotal(data.total);

} catch (error) {
  console.error("Ürünler yüklenirken hata:", error);
  setProducts([]);
  setTotal(0);
} finally {
  setLoading(false);
}

    }

    loadProducts();
  }, [searchTerm, categorySlug, page, limit, sortBy]);

  return { products, total, loading };
}










// ---------------------------------------------------------------------------------------------------
/* import { useEffect, useState } from "react";
import { fetchAllProducts, searchProducts, fetchProductsByCategory } from "@/services/products";

export function useProducts({ searchTerm, categorySlug, page = 1, limit = 12 }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);

      const skip = (page - 1) * limit;

      try {
        let data;
        if (searchTerm) {
          // Arama varsa
          data = await searchProducts(searchTerm, limit, skip);
        } else if (categorySlug) {
          // Kategori seçilmişse
          data = await fetchProductsByCategory(categorySlug, limit, skip);
        } else {
          // Normal tüm ürünler
          data = await fetchAllProducts(limit, skip);
        }

        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [searchTerm, categorySlug, page, limit]);

  return { products, total, loading };
} */
