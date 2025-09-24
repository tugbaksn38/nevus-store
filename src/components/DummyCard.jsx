/* src/components/DummyCard.jsx */

"use client";

import React from "react";
import "./DummyCard.css"; // CSS dosyasını import ediyoruz

export default function DummyCard() {
  return (
    <div className="card">
      <p className="heading">Popular this month</p>
      <p>Powered By</p>
      <p>Uiverse</p>
    </div>
  );
}
