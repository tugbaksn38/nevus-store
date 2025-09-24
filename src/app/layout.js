'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="relative">
        <button
          onClick={toggleTheme}
          className="fixed bottom-6 right-6 z-50 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Tema değiştir"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>

        {children}
      </body>
    </html>
  );
}
