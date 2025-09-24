// 4. BÖLÜM - KATEGORİ ORANLARI - PASTA GRAFİĞİ KISMI

// src/components/CategoryPieChart.js
"use client";

import { useEffect, useState } from "react";
import { fetchCategories, fetchProductsByCategory } from "@/services/products";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CategoryPieChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Renk paleti
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#AA336A", "#A0A0A0", "#4B0082", "#FF6347",
    "#FFD700", "#2E8B57", "#1E90FF", "#9932CC"
  ];

  useEffect(() => {
    async function loadCategoryData() {
      try {
        // 1. Tüm kategorileri al
        const categories = await fetchCategories();

        // String ise obje formatına çevir
        const formatted = categories.map((cat) =>
          typeof cat === "string" ? { slug: cat, name: cat } : cat
        );

        // 2. Her kategori için ürün sayısını çek
        const categoryCounts = await Promise.all(
          formatted.map(async (cat) => {
            const res = await fetchProductsByCategory(cat.slug, 1, 0); // limit=1 hızlı olsun
            return {
              name: cat.name,
              value: res.total, // toplam ürün sayısı
            };
          })
        );

        setData(categoryCounts);
      } catch (error) {
        console.error("Kategori oranları alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, []);

  if (loading) return <p>Kategori oranları yükleniyor...</p>;

  return (
    <div className="w-full h-[500px]">

<ResponsiveContainer>
  <PieChart>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="45%" // biraz yukarı alıyoruz ki altta boşluk olsun
      outerRadius={120}
      fill="#8884d8"
      label
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend
      verticalAlign="bottom"
      align="center"
      wrapperStyle={{
        paddingTop: "5px"
      }}
    />
  </PieChart>
</ResponsiveContainer>


    </div>
  );
}
