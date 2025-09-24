// app/api/nevus/ev-tekstili/route.js
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
      
      // Sadece "Ev Tekstili" kategorisindeki ürünleri filtrele
      const evTekstiliProducts = allProducts.filter(product => 
        product.category === "Ev Tekstili"
      );
      
      console.log("📁 JSON dosyasından Ev Tekstili ürünleri alındı");
      return NextResponse.json({ 
        products: evTekstiliProducts, 
        source: "json_file",
        category: "Ev Tekstili",
        count: evTekstiliProducts.length,
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