// src/app/api/login/route.js

// src/app/api/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const res = NextResponse.json({ success: true });

    // Basit bir "var/yok" token; istersen burada imzalı/signed da yapabilirsin (aşağıda not var).
    res.cookies.set({
      name: "auth",
      value: "ok",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 saat
    });

    return res;
  }

  return NextResponse.json(
    { success: false, message: "Hatalı kullanıcı adı veya şifre" },
    { status: 401 }
  );
}
