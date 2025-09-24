// src/app/charts/page.js

"use client";

import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";
import CategoryChart from "@/components/CategoryChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import LineChart from "@/components/LineChart";
import FakeStoreChart from "@/components/FakeStoreChart";
import { useRouter } from "next/navigation";
import NevusChart from "@/components/NevusChart";

export default function ChartsPage() {
  const router = useRouter();
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://dummyjson.com/products");
        const json = await res.json();

        const grouped = json.products.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([category, count]) => ({
          kategori: category,
          adet: count,
        }));

        setLineData(formatted);
      } catch (err) {
        console.error("API error:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 min-h-screen text-gray-900 bg-chart dark:text-[var(--foreground)]">
      {/* Üst kısım */}
      <div className="flex items-center gap-4 mb-10">
        <BackButton />
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          📊 Grafikler
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Kategori Ortalamaları */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Kategori Bazlı Ortalama Fiyatlar (40 ürün)
          </h2>
          <NevusChart />
        </div>

        {/* ESKİ GENİŞ DURDURAN KOD - gbg-white rounded-2xl shadow-xl p-6 col-span-1 md:col-span-2*/}
        {/* YENİ YAN YANA DURDURAN KOD - bg-white rounded-2xl shadow-xl p-6*/}

        {/* Çizgi Grafiği */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Zaman Serisi - Kategorilere Göre Ürün Adedi
          </h2>
          <LineChart
            data={lineData}
            xKey="kategori"
            yKey="adet"
            color="#ff7300"
          />
        </div>

        {/* Sütun Grafiği */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Sütun Grafiği
          </h2>
          <CategoryChart />
        </div>

        {/* Fake Store API Grafiği */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Fake Store Ürün Fiyatları
          </h2>
          <FakeStoreChart />
        </div>

        {/* Pasta Grafiği */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Kategori Dağılımı (Pasta Grafiği)
          </h2>
          <CategoryPieChart />
        </div>
      </div>
    </div>
  );
}
