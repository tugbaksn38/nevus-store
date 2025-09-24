

/*
// app/api/nevus/route.js
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";

export async function GET() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log("📌 API çağrıldı");

    await page.goto("https://www.storish.com/genc-ve-bebek/", {
      waitUntil: "networkidle2",
    });

    const products = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".js-product-wrapper")).map(el => {
        const name = el.querySelector(".product-item__name")?.innerText?.trim();
        const link = el.querySelector(".product-item__name")?.href;
        const image = el.querySelector(".product-item__image img")?.src;

        const price = el.querySelector(".product-item__price pz-price")?.innerText?.trim();
        const campaignPrice = el.querySelector(".product-item__campaign pz-price")?.innerText?.trim();

        return {
          name,
          price: campaignPrice || price, // varsa kampanya fiyatını al
          originalPrice: price,
          image,
          link,
        };
      });
    });

    await browser.close();
    console.log("✅ Ürün sayısı:", products.length);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("❌ Scrape error:", error);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}
*/