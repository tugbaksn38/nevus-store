//src/app/admin/page.js
// src/app/admin/page.js

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { validateAdminLogin } from "../../lib/validation";

// 🔹 Suspense içinde çalışacak bileşen
function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]); // hem validasyon hem backend hataları

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors([]);

    // 📌 Validasyon kontrolü
    const validationErrors = validateAdminLogin(username, password);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.replace(from);
      } else {
        setErrors([data.message || "Giriş başarısız"]);
      }
    } catch {
      setErrors(["Sunucu hatası"]);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/arkaplan.png')" }}
    >
      {/* Arka plan overlay */}
      <div className="absolute inset-0"></div>

      {/* Form */}
      <AnimatePresence>
        <motion.form
          onSubmit={handleLogin}
          className="relative bg-white p-8 rounded-3xl shadow-2xl w-96 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Admin Girişi
          </h1>

          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border text-gray-900 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border text-gray-900 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 shadow-lg transition-all duration-300"
          >
            Giriş Yap
          </button>

          {/* 📌 Hata listesi */}
          <AnimatePresence>
            {errors.length > 0 && (
              <motion.ul
                key="error-list"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-2 space-y-1 list-disc list-inside"
              >
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}

// 🔹 Suspense Wrapper
export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Yükleniyor...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
