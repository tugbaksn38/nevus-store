// src/components/NevusChart.js

"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// API endpoint + kategori eşleştirmesi
const CATEGORIES = [
  { key: "yatak-odasi", name: "Yatak Odası" },
  { key: "genc", name: "Genç & Bebek" }, 
  { key: "oturma", name: "Oturma Odası" },
  { key: "ev-tekstili", name: "Ev Tekstili" },
  { key: "nevus-deppo", name: "Nevus Deppo" },
  { key: "yemek-odasi", name: "Yemek Odası" },
  { key: "dekorasyon", name: "Dekorasyon" }

];

export default function NevusChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await Promise.all(
          CATEGORIES.map(async (cat) => {
            try {
              const res = await fetch(`/api/nevus/${cat.key}`);
              const json = await res.json();

              if (!json.products) return { kategori: cat.name, ort: 0 };

              // fiyatı parse et → "12.345,67 TL" → 12345.67
              const prices = json.products
                .map((p) =>
                  parseFloat(
                    (p.price || "")
                      .replace(/[^\d,]/g, "")
                      .replace(",", ".")
                  )
                )
                .filter((n) => !isNaN(n))
                .slice(0, 40); // sadece ilk 40 ürün

              const ort =
                prices.length > 0
                  ? prices.reduce((a, b) => a + b, 0) / prices.length
                  : 0;

              return { kategori: cat.name, ort: Math.round(ort) };
            } catch (err) {
              console.error(`Kategori hatası (${cat.key}):`, err);
              return { kategori: cat.name, ort: 0 };
            }
          })
        );

        setData(results);
      } catch (err) {
        console.error("Genel hata:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Kategori ortalamaları yükleniyor...</p>;

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="kategori"
          interval={0}    // 🔹 tüm kategori etiketlerini göster
          angle={-15}     // 🔹 hafif eğik yaz
          textAnchor="end"
        />
        <YAxis />
          <Tooltip formatter={(v) => `${v.toLocaleString("tr-TR")} TL`} />
          <Bar dataKey="ort" fill="#3b82f6" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
