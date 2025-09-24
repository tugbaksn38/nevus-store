// src/app/forum/page.js

"use client";
import { useState, useEffect } from "react";
import BackButton from "@/components/BackButton";
import { addForumPost } from "@/firebase/forumService";
import { Send, MessageCircle, User, Phone, Fingerprint, AlertCircle, CheckCircle } from "lucide-react";

export default function ForumPage() {
  const [tc, setTc] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];

    // Validasyonlar...
    if (!/^[0-9]{11}$/.test(tc)) {
      newErrors.push("TC Kimlik numarası 11 haneli olmalı ve sadece rakam içermelidir.");
    }
    if (!name.trim()) {
      newErrors.push("Ad Soyad boş olamaz.");
    } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(name)) {
      newErrors.push("Ad Soyad sadece harflerden oluşabilir.");
    }
    if (!/^[0-9]{10,11}$/.test(phone)) {
      newErrors.push("Telefon numarası 10 veya 11 haneli olmalı ve sadece rakam içermelidir.");
    }
    if (!message.trim()) {
      newErrors.push("Mesaj boş olamaz.");
    } else if (message.length < 10) {
      newErrors.push("Mesaj en az 10 karakter olmalı.");
    } else if (message.length > 200) {
      newErrors.push("Mesaj en fazla 200 karakter olabilir.");
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setLoading(true);
      try {
        await addForumPost({ tc, name, phone, message });
        setSuccess(true);
        setTc(""); 
        setName(""); 
        setPhone(""); 
        setMessage("");
        setErrors([]);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setErrors(["Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin."]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background text-gray-900 dark:text-foreground py-8 px-4">

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <BackButton />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Forum
          </h1>
          <div className="w-10"></div> {/* Boşluk için */}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100 transform transition-all duration-300 hover:shadow-2xl">
          {/* Başlık */}
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-indigo-100 rounded-full">
              <MessageCircle className="text-indigo-600" size={28} />
            </div>
            <h2 className="ml-3 text-xl font-semibold text-gray-100 dark:text-black">
  Mesajınızı Paylaşın
</h2>


          </div>

          {/* Başarı Mesajı */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center animate-fade-in">
              <CheckCircle className="mr-2 flex-shrink-0" size={20} />
              <span>Mesajınız başarıyla gönderildi!</span>
            </div>
          )}

          {/* Hata Mesajları */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-shake">
              <div className="flex items-center mb-2">
                <AlertCircle className="mr-2 flex-shrink-0" size={20} />
                <span className="font-medium">Düzeltmeniz gereken hatalar:</span>
              </div>
              <ul className="list-disc list-inside ml-6">
                {errors.map((err, i) => (
                  <li key={i} className="text-sm">{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
            {/* TC Kimlik No */}
            <div className="relative ">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Fingerprint className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={tc}
                onChange={(e) => setTc(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="TC Kimlik No"
                maxLength={11}
              />
            </div>

            {/* Ad Soyad */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Ad Soyad"
              />
            </div>

            {/* Telefon Numarası */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Telefon Numarası"
                maxLength={11}
              />
            </div>

            {/* Mesaj */}
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                placeholder="Mesajınızı yazın..."
                rows={4}
                maxLength={200}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                {charCount}/200
              </div>
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Gönder
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bilgi Kutusu */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-sm text-indigo-700">
          <h3 className="font-semibold mb-2 flex items-center">
            <InfoIcon className="mr-2" size={18} />
            Forum Kuralları
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Lütfen saygılı bir dil kullanın</li>
            <li>Kişisel bilgilerinizi paylaşmayın</li>
            <li>Spam ve reklam içerik göndermeyin</li>
          </ul>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Basit bir info ikonu (lucide-react'ta yoksa)
function InfoIcon({ className, size }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );
}