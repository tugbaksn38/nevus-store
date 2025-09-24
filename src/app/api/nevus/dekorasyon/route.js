// app/api/nevus/dekorasyon/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// JSON dosya yolu
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'products.json');

// API Route
export async function GET() {
  try {
    // JSON dosyasını oku
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const allProducts = JSON.parse(fileData);
      
      // Sadece "Dekorasyon" kategorisindeki ürünleri filtrele
      const dekorasyonProducts = allProducts.filter(product => 
        product.category === "Dekorasyon"
      );
      
      console.log("📁 JSON dosyasından Dekorasyon ürünleri alındı");
      return NextResponse.json({ 
        products: dekorasyonProducts, 
        source: "json_file",
        category: "Dekorasyon",
        count: dekorasyonProducts.length,
        totalProducts: allProducts.length
      });
    }

    // Eğer JSON dosyası yoksa hata döndür
    console.error("❌ JSON dosyası bulunamadı:", DATA_FILE_PATH);
    return NextResponse.json({ 
      error: "JSON dosyası bulunamadı. Önce verileri çekip kaydetmelisiniz." 
    }, { status: 404 });

  } catch (error) {
    console.error("❌ Dosya okuma hatası:", error);
    return NextResponse.json({ error: "Dosya okuma başarısız" }, { status: 500 });
  }
}

// NOT: saveProductsToFile fonksiyonu burada GEREKSİZ!
// Bu fonksiyon sadece scripts/Kaydet.js'te olmalı