// src/components/BackButton.js

"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "← Geri" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      style={{
        background: "#3f140fff",
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        color: "white", // Yazı rengi burada
        display: "block",   // Buton blok olacak
        marginLeft: "10px",     // Sola yapışacak
        marginBottom: "25px", // Alt boşluk burası
      }}
    >
      {label}
    </button>
  );
}


/*
       <button
          onClick={() => router.back()}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          ← Geri
        </button>
        */
