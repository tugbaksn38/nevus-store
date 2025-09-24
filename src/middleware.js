// src/middleware.js
// src/middleware.js

import { NextResponse } from "next/server";

/**
 * Mantık:
 * - Cookie (auth) YOKSA ve /admin dışında bir yere gidiyorsa => /admin'e yönlendir
 * - Cookie VARSA ve /admin'e gidiyorsa => ana sayfaya yönlendir
 * - Statik dosyalar ve login/logout API'leri dokunmadan geçer
 */
export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth")?.value;

  // Login sayfasındayken girişliyse ana sayfaya at
  if (pathname === "/admin") {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Giriş yoksa admin dışındaki her şeyi admin'e yönlendir
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    // from parametresi artık eklenmiyor
    return NextResponse.redirect(url);
  }

  // Girişliyse aynen devam
  return NextResponse.next();
}

// Middleware hangi yolları kapsayacak
export const config = {
  matcher: [
    "/((?!admin|api/login|api/logout|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)",
    "/admin",
  ],
};


