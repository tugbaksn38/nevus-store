// 2. BÖLÜM - KATEGORİ BUTONLARI KISMI

// src/components/CategoryFilter.js
"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/services/products";

export default function CategoryFilter({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();

        // Gelen veri string mi object mi kontrol et
        const formatted = data.map((cat) =>
          typeof cat === "string" ? { slug: cat, name: cat } : cat
        );

        setCategories(formatted);
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) return <p>Kategoriler yükleniyor...</p>;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={`px-3 py-1 border rounded ${selected === null ? "bg-blue-500 text-white" : ""}`}
        onClick={() => {
          setSelected(null);
          onSelect(null);
        }}
      >
        Tümü
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug} // artık her zaman benzersiz
          className={`px-3 py-1 border rounded ${selected === cat.slug ? "bg-blue-500 text-white" : ""}`}
          onClick={() => {
            setSelected(cat.slug);
            onSelect(cat.slug);
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
