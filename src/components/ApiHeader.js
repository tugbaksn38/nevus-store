// src/components/ApiHeader.js
// src/components/ApiHeader.js
"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";

export default function ApiHeader({ cartCount = 0, onCartClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [

  ];

  return (
    <header className="flex items-center justify-between bg-[#b69243] text-white px-6 py-3 shadow-md relative">
      {/* Sol: Menü Butonu + Logo */}
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

{/* Orta: Menü */}
<nav className="hidden md:flex flex-1 justify-center items-center gap-6">
  <Link href="/" className="text-3xl font-bold">
    NEVUS STORE
  </Link>
</nav>


      {/* Sağ: Sepet */}
      <button
        onClick={onCartClick}
        className="flex items-center gap-2 bg-blue-600 px-3 py-2 rounded hover:bg-blue-500"
      >
        <ShoppingCart size={20} />
        <span>{cartCount}</span>
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}

