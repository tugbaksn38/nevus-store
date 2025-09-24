// app/api/nevus/nevus-deppo/route.js
// STORISH DEPPO KATEGORİSİ - JSON'dan okuyor
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
      
      // Sadece "Storish Deppo" kategorisindeki ürünleri filtrele
      const storishDeppoProducts = allProducts.filter(product => 
        product.category === "Storish Deppo"
      );
      
      console.log("📁 JSON dosyasından Storish Deppo ürünleri alındı");
      return NextResponse.json({ 
        products: storishDeppoProducts, 
        source: "json_file",
        category: "Storish Deppo",
        count: storishDeppoProducts.length,
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