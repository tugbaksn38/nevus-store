// src/hooks/useFakeStoreProducts.js

import { useEffect, useState } from "react";
import { 
  fetchFakeStoreProducts, 
  fetchFakeStoreCategories, 
  fetchFakeStoreProductsByCategory 
} from "@/services/products";


// -----------------------------------------------------------------------------------------------
export function useFakeStoreProducts({ searchTerm, categorySlug, page, limit }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);  // Kategoriler için state
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

// -----------------------------------------------------------------------------------------------
  // Kategorileri sadece bir kere çek
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchFakeStoreCategories();
        setCategories(cats);
      } catch {
        setCategories([]);
      }
    }
    loadCategories();
  }, []);


// -----------------------------------------------------------------------------------------------
  // Ürünleri sayfa, kategori veya arama değiştiğinde çek
  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        let data;
        if (categorySlug) {
  data = await fetchFakeStoreProductsByCategory(categorySlug);
} else if (searchTerm) {


          data = await fetchFakeStoreProducts();
          data.products = data.products.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          data.total = data.products.length;
        } else {
          data = await fetchFakeStoreProducts();
        }

        setProducts(data.products);
        setTotal(data.total || data.products.length);
      } catch (error) {
        console.error("Fake Store ürünler yüklenirken hata:", error);
        setProducts([]);
        setTotal(0);
      }
      setLoading(false);
    }
    load();
  }, [searchTerm, categorySlug, page, limit]);

  return { products, loading, total, categories }; // Kategorileri döndür
}
