// scripts/Kaydet.js
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'products.json');

// Tüm kategori URL'leri
const CATEGORY_URLS = [
  { url: "https://www.storish.com/dekorasyon/", category: "Dekorasyon" },
  { url: "https://www.storish.com/ev-tekstili/", category: "Ev Tekstili" },
  { url: "https://www.storish.com/genc-ve-bebek/", category: "Genç ve Bebek" },
  { url: "https://www.storish.com/storish-deppo/", category: "Storish Deppo" },
  { url: "https://www.storish.com/oturma-odasi/", category: "Oturma Odası" },
  { url: "https://www.storish.com/yatak-odasi/", category: "Yatak Odası" },
  { url: "https://www.storish.com/yemek-odasi/", category: "Yemek Odası" }
];

async function fetchProducts() {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Kullanıcı ajanı ayarla (isteğe bağlı)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    let allProducts = [];

    console.log("📌 Tüm kategorilerden ürünler çekiliyor...");

    // Her kategori için döngü
    for (const categoryInfo of CATEGORY_URLS) {
      console.log(`🔍 ${categoryInfo.category} kategorisi işleniyor: ${categoryInfo.url}`);
      
      try {
        await page.goto(categoryInfo.url, {
          waitUntil: "networkidle2",
          timeout: 30000
        });

        // Sayfanın yüklenmesini bekle
        await page.waitForSelector('.js-product-wrapper', { timeout: 15000 });

        const categoryProducts = await page.evaluate((categoryInfo) => {
          return Array.from(document.querySelectorAll(".js-product-wrapper")).map(el => {
            const name = el.querySelector(".product-item__name")?.innerText?.trim();
            const link = el.querySelector(".product-item__name")?.href;
            const image = el.querySelector(".product-item__image img")?.src;
            
            // SKU/ID bilgisini çekme
            let sku = null;
            const dataSku = el.getAttribute('data-sku');
            const dataId = el.getAttribute('data-id');
            const productId = el.getAttribute('data-product-id');
            
            // Öncelik sırasına göre SKU belirleme
            if (dataSku) sku = dataSku;
            else if (dataId) sku = dataId;
            else if (productId) sku = productId;
            
            // Eğer hiçbiri yoksa, linkten ID çıkarmayı dene
            if (!sku && link) {
              const idMatch = link.match(/\/(\d+)\/?$/);
              if (idMatch) sku = idMatch[1];
            }

            const price = el.querySelector(".product-item__price pz-price")?.innerText?.trim();
            const campaignPrice = el.querySelector(".product-item__campaign pz-price")?.innerText?.trim();

            return {
              id: sku, // SKU/ID bilgisini ekle
              name,
              price: campaignPrice || price,
              originalPrice: price,
              image,
              link,
              category: categoryInfo.category,
              categoryUrl: categoryInfo.url
            };
          });
        }, categoryInfo);

        console.log(`✅ ${categoryInfo.category}: ${categoryProducts.length} ürün bulundu`);
        allProducts = allProducts.concat(categoryProducts);

        // Bir sonraki kategori için kısa bekleme
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ ${categoryInfo.category} kategorisinde hata:`, error.message);
        // Hata olsa bile diğer kategorilere devam et
        continue;
      }
    }

    await browser.close();
    
    console.log("📊 Toplam ürün sayısı:", allProducts.length);
    console.log("🏷️  Kategori dağılımı:");
    
    // Kategori bazlı istatistik
    const categoryStats = {};
    allProducts.forEach(product => {
      categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    });
    
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} ürün`);
    });

    // Benzersiz ID kontrolü
    const uniqueIds = new Set(allProducts.map(p => p.id));
    console.log(`🔢 Benzersiz SKU/ID sayısı: ${uniqueIds.size}`);
    
    if (uniqueIds.size < allProducts.length) {
      console.warn("⚠️  Bazı ürünler aynı ID'ye sahip olabilir!");
    }

    // data klasörünü oluştur (yoksa)
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Verileri JSON dosyasına kaydet
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(allProducts, null, 2));
    console.log("📁 Tüm ürünler JSON dosyasına kaydedildi:", DATA_FILE_PATH);

    return allProducts;
  } catch (error) {
    console.error("❌ Genel scrape hatası:", error);
    throw error;
  }
}

// Script'i çalıştır
fetchProducts().then((products) => {
  console.log("🎉 Tüm veri çekme ve kaydetme işlemi tamamlandı!");
  console.log(`📦 Toplam ${products.length} ürün kaydedildi.`);
  process.exit(0);
}).catch(error => {
  console.error("💥 İşlem başarısız:", error);
  process.exit(1);
});
/*
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'products.json');

// Tüm kategori URL'leri
const CATEGORY_URLS = [
  { url: "https://www.storish.com/dekorasyon/", category: "Dekorasyon" },
  { url: "https://www.storish.com/ev-tekstili/", category: "Ev Tekstili" },
  { url: "https://www.storish.com/genc-ve-bebek/", category: "Genç ve Bebek" },
  { url: "https://www.storish.com/storish-deppo/", category: "Storish Deppo" },
  { url: "https://www.storish.com/oturma-odasi/", category: "Oturma Odası" },
  { url: "https://www.storish.com/yatak-odasi/", category: "Yatak Odası" },
  { url: "https://www.storish.com/yemek-odasi/", category: "Yemek Odası" }
];

async function fetchProducts() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    let allProducts = [];

    console.log("📌 Tüm kategorilerden ürünler çekiliyor...");

    // Her kategori için döngü
    for (const categoryInfo of CATEGORY_URLS) {
      console.log(`🔍 ${categoryInfo.category} kategorisi işleniyor: ${categoryInfo.url}`);
      
      try {
        await page.goto(categoryInfo.url, {
          waitUntil: "networkidle2",
          timeout: 30000
        });

        // Sayfanın yüklenmesini bekle
        await page.waitForSelector('.js-product-wrapper', { timeout: 10000 });

        const categoryProducts = await page.evaluate((categoryInfo) => {
          return Array.from(document.querySelectorAll(".js-product-wrapper")).map(el => {
            const name = el.querySelector(".product-item__name")?.innerText?.trim();
            const link = el.querySelector(".product-item__name")?.href;
            const image = el.querySelector(".product-item__image img")?.src;

            const price = el.querySelector(".product-item__price pz-price")?.innerText?.trim();
            const campaignPrice = el.querySelector(".product-item__campaign pz-price")?.innerText?.trim();

            return {
              name,
              price: campaignPrice || price,
              originalPrice: price,
              image,
              link,
              category: categoryInfo.category,
              categoryUrl: categoryInfo.url
            };
          });
        }, categoryInfo);

        console.log(`✅ ${categoryInfo.category}: ${categoryProducts.length} ürün bulundu`);
        allProducts = allProducts.concat(categoryProducts);

        // Bir sonraki kategori için kısa bekleme
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ ${categoryInfo.category} kategorisinde hata:`, error.message);
        // Hata olsa bile diğer kategorilere devam et
        continue;
      }
    }

    await browser.close();
    
    console.log("📊 Toplam ürün sayısı:", allProducts.length);
    console.log("🏷️  Kategori dağılımı:");
    
    // Kategori bazlı istatistik
    const categoryStats = {};
    allProducts.forEach(product => {
      categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    });
    
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} ürün`);
    });

    // data klasörünü oluştur (yoksa)
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Verileri JSON dosyasına kaydet
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(allProducts, null, 2));
    console.log("📁 Tüm ürünler JSON dosyasına kaydedildi:", DATA_FILE_PATH);

    return allProducts;
  } catch (error) {
    console.error("❌ Genel scrape hatası:", error);
    throw error;
  }
}

// Script'i çalıştır
fetchProducts().then((products) => {
  console.log("🎉 Tüm veri çekme ve kaydetme işlemi tamamlandı!");
  console.log(`📦 Toplam ${products.length} ürün kaydedildi.`);
  process.exit(0);
}).catch(error => {
  console.error("💥 İşlem başarısız:", error);
  process.exit(1);
}); */