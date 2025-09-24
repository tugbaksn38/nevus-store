// src/components/admin/Sidebar.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("loggedIn");
      setIsOpen(false);
      router.push("/admin");
    } catch (error) {
      console.error("Çıkış yapılamadı:", error);
    }
  };

  if (!mounted) return null;

  const navItems = [
    { label: "Ana Sayfa", path: "/" },
    { label: "Grafikler", path: "/charts" },
    { label: "Fake Store", path: "/fakestore" },
    { label: "Food Facts", path: "/foodfacts" },
    { label: "Users", path: "/users" },
    { label: "NEVUS", path: "/nevus/genc" },
    { label: "Forum", path: "/forum" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl transform transition-transform duration-500 z-999
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col`}
      >

{/* Header */}
<div className="flex flex-col items-center p-4 border-b border-purple-700">
  {/* Logo */}
  {/* Logo */}
<img
  src="/logo.png"
  alt="Nevus Logo"
  className="h-45 w-45 mb-2 rounded-full object-cover"
/>


  {/* Başlık */}
  <div className="flex items-center justify-between w-full">
    <h2 className="text-xl font-bold tracking-wide">Menü</h2>
    <button
      onClick={() => setIsOpen(false)}
      className="text-gray-300 hover:text-white transition-colors text-lg"
    >
      ✕
    </button>
  </div>
</div>


        {/* Navigation */}
        <nav className="flex flex-col mt-4 space-y-3 px-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { router.push(item.path); setIsOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout - En Alta */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-[#dfc873] text-[#020202] font-bold hover:bg-red-500 hover:scale-105 transform transition-all duration-300 rounded-lg shadow-md"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </>
  );
}
