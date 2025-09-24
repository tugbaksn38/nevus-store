// app/api/nevus/yemek-odasi/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// JSON dosya yolu
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'products.json');

export async function GET() {
  try {
    // JSON dosyasını oku
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const allProducts = JSON.parse(fileData);
      
      // Sadece "Yemek Odası" kategorisindeki ürünleri filtrele
      const yemekOdasiProducts = allProducts.filter(product => 
        product.category === "Yemek Odası"
      );
      
      console.log("📁 JSON dosyasından Yemek Odası ürünleri alındı");
      return NextResponse.json({ 
        products: yemekOdasiProducts, 
        source: "json_file",
        category: "Yemek Odası",
        count: yemekOdasiProducts.length,
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