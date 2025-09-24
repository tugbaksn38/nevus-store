// src/app/fakestore/page.js

"use client";

import BackButton from "@/components/BackButton"; // bileşeni eklemeyi unutma
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFakeStoreProducts } from "@/hooks/useFakeStoreProducts";
import FakeStoreProductList from "@/components/FakeStoreProductList";
import FakeStoreCategoryFilter from "@/components/FakeStoreCategoryFilter";

// ------------------------------------------------------------------------------------------

export default function FakeStorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySlug, setCategorySlug] = useState();
  const [page, setPage] = useState(1);



// ------------------------------------------------------------------------------------------
  const { products, loading, total, categories } = useFakeStoreProducts({
    searchTerm,
    categorySlug,
    page,
    limit: 12,
  });


// ------------------------------------------------------------------------------------------
  return (
    <div className="p-4">
      {/* Üst kısım: Geri butonu + Başlık */}
      <div className="flex items-center gap-4 mb-6">
        <BackButton /> {/* Geri butonu */}
        <h1 className="text-2xl font-bold">Fake Store Ürünleri</h1>
      </div>

      {/* Arama kutusu */}
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

      {/* Kategori filtresi */}
      {Array.isArray(categories) && categories.length > 0 && (
        <FakeStoreCategoryFilter
          categories={categories}
          onSelect={(slug) => {
            setCategorySlug(slug);
            setPage(1);
          }}
        />
      )}

      {/* Grafik butonu */}
      <button
        onClick={() => router.push("/charts")}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Grafiklere Git
      </button>

      {/* Ürün listesi */}
      {loading ? <p>Yükleniyor...</p> : <FakeStoreProductList products={products} />}

      {/* Sayfalama */}
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
  );
}
