// src/app/api/logout/route.js

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Cookie’yi sil
  res.cookies.set({
    name: "auth",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return res;
}
