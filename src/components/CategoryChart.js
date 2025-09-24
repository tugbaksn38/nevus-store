// 3. BÖLÜM - KATEGORİ DAĞILIMI KISMI
// src/components/CategoryChart.js
// src/components/CategoryChart.js
"use client";

import { useEffect, useState } from "react";
import { fetchCategories, fetchProductsByCategory } from "@/services/products";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CategoryChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        // 1️⃣ Kategorileri al
        const categories = await fetchCategories();

        // String ise → object’e çevir
        const formatted = categories.map((cat) =>
          typeof cat === "string" ? { slug: cat, name: cat } : cat
        );

        // 2️⃣ Her kategori için ürün sayısını al
        const categoryCounts = await Promise.all(
          formatted.map(async (cat) => {
            const res = await fetchProductsByCategory(cat.slug, 1, 0); // sadece toplam sayıyı alıyoruz
            return {
              kategori: cat.name,
              adet: res.total, // toplam ürün sayısı
            };
          })
        );

        setData(categoryCounts);
      } catch (error) {
        console.error("Kategori dağılımı alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, []);

  if (loading) return <p>Kategori dağılımı yükleniyor...</p>;

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="kategori"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={70}
            tick={{
              fontSize:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 10
                  : 14,
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="adet"
            fill="#8884d8"
            barCategoryGap="30%"
            barGap={5}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
