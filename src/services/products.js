// src/services/products.js

// API'den veri çekmek için dört farklı fonksiyon tanımlıyoruz.
// Bu fonksiyonlar sayesinde component'lerde doğrudan fetch yazmak yerine,
// burada toplu şekilde API işlemlerini yönetebiliyoruz.

// 1️⃣ TÜM ÜRÜNLERİ GETİREN FONKSİYON
export async function fetchAllProducts(limit = 12, skip = 0) {
  // limit → kaç tane ürün çekileceğini belirler (varsayılan 12)
  // skip → kaç ürünü atlayarak devam edileceğini belirler (varsayılan 0)

  // API'ye GET isteği gönderiyoruz
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);

  // Eğer API'den hata gelirse (status 200 değilse) hata fırlatıyoruz
  if (!res.ok) throw new Error("Ürünler alınamadı");

  // API cevabını JSON formatına çeviriyoruz
  const data = await res.json();

  // Sadece products (ürün listesi) ve total (toplam ürün sayısı) bilgilerini dönüyoruz
  return { products: data.products, total: data.total };
}
//----------------------------------------------------------------------------------------------
// 2️⃣ ARAMA YAPARAK ÜRÜNLERİ GETİREN FONKSİYON
export async function searchProducts(query, limit = 12, skip = 0) {
  // query → aramak istediğimiz kelime (ör. "phone")
  const res = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`);

  // Hatalı durumlarda hata mesajı fırlat
  if (!res.ok) throw new Error("Arama başarısız");

  // JSON'a çevir
  const data = await res.json();

  // products → eşleşen ürünler
  // total → arama sonucu bulunan toplam ürün sayısı
  return { products: data.products, total: data.total };
}
//----------------------------------------------------------------------------------------------
// 3️⃣ TÜM KATEGORİLERİ GETİREN FONKSİYON
export async function fetchCategories() {
  // /products/categories endpoint'i bize kategorileri verir
  const res = await fetch("https://dummyjson.com/products/categories");

  // Hata kontrolü
  if (!res.ok) throw new Error("Kategoriler alınamadı");

  // JSON veriyi direkt döndürüyoruz
  // Not: DummyJSON kategorileri sadece string array olarak döner.
  // Ama sen buraya "// object array geliyor { slug, name, url }" yazmışsın,
  // DummyJSON aslında bunu sağlamıyor, sadece ["smartphones","laptops", ...] döner.
  return await res.json();
}
//----------------------------------------------------------------------------------------------
// 4️⃣ BELİRLİ BİR KATEGORİDEKİ ÜRÜNLERİ GETİREN FONKSİYON
export async function fetchProductsByCategory(categorySlug, limit = 12, skip = 0) {
  const res = await fetch(`https://dummyjson.com/products/category/${categorySlug}?limit=${limit}&skip=${skip}`);

  if (!res.ok) throw new Error("Kategori ürünleri alınamadı");

  const data = await res.json();

  return { products: data.products, total: data.total };
}

// Fake Store API'den ürünleri getiren fonksiyon
export async function fetchFakeStoreProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Fake Store ürünleri alınamadı");
  const data = await res.json();

  // data doğrudan ürün dizisi olarak geliyor, total yok
  return { products: data, total: data.length };
}


export async function fetchFakeStoreProductsByCategory(category) {
  const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
  if (!res.ok) throw new Error("Fake Store kategori ürünleri alınamadı");
  const data = await res.json();
  return { products: data, total: data.length };
}

export async function fetchFakeStoreCategories() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  if (!res.ok) throw new Error("Fake Store kategoriler alınamadı");
  const data = await res.json();
  return data; // array string döner
}

// ----------------------------------------------------------

// Food Facts API
export async function fetchFoodProducts(page = 1, limit = 20) {
  const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page=${page}&page_size=${limit}`);
  if (!res.ok) throw new Error("API isteği başarısız oldu");
  const data = await res.json();

  return {
    products: data.products || [],
    total: data.count || 0,
  };
}

// ----------------------------------------------------------

export async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
}
