// components/BubbleAnimation.jsx
"use client"; // Next.js App Router için

import React from "react";
import "./BubbleAnimation.css"; // CSS'i ayrı dosyada tutuyoruz

const BubbleAnimation = () => {
  return (
    <div className="Strich1">
      <div className="Strich2">
        <div className="bubble"></div>
        <div className="bubble1"></div>
        <div className="bubble2"></div>
        <div className="bubble3"></div>
        <div className="bubble4"></div>
      </div>
    </div>
  );
};

export default BubbleAnimation;
