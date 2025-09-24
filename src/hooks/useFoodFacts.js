// src/hooks/useFoodFacts.js

"use client";

import { useState, useEffect } from "react";
import { fetchFoodProducts } from "@/services/products";

export function useFoodFacts(page = 1, pageSize = 20) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFoodProducts(page, pageSize);
        setProducts(data.products);
        setTotal(data.total);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, pageSize]);

  return { products, total, loading, error };
}
