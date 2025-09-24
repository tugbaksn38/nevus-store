// components/FakeStoreChart.js

"use client";

import { useEffect, useState } from "react";
import { fetchFakeStoreProducts } from "@/services/products";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FakeStoreChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { products } = await fetchFakeStoreProducts();

        // 📌 Kategoriye göre grupla
        const grouped = products.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {});

        // 📌 Recharts formatına çevir
        const chartData = Object.entries(grouped).map(([category, count]) => ({
          kategori: category,
          ADET: count,
        }));

        setData(chartData);
      } catch (error) {
        console.error("Fake Store ürün verisi alınamadı:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p>Fake Store ürünleri yükleniyor...</p>;
  if (!data.length) return <p>Gösterilecek veri yok.</p>;

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
            angle={-30}
            textAnchor="end"
            height={70}
            interval={0}
            tick={{ fontSize: 18 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ADET" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
