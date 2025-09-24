// components/HoverCard.js
import React from 'react';
import Link from 'next/link';
import './HoverCard.css';

const HoverCard = ({ children, href, isExternal = false }) => {
  // Eğer external link ise normal <a> etiketi kullan
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover-card-container noselect block relative"
      >
        <div className="canvas">
          {[...Array(25)].map((_, i) => (
            <div key={i} className={`tracker tr-${i+1}`} />
          ))}
          <div className="hover-card">
            <p className="prompt"></p>
            <div className="hover-title"></div>
            <div className="hover-subtitle"></div>
            <div className="hover-card-content w-full h-full">
              {children}
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Internal link ise Next.js Link bileşenini kullan
  return (
    <Link
      href={href}
      className="hover-card-container noselect block relative"
    >
      <div className="canvas">
        {[...Array(25)].map((_, i) => (
          <div key={i} className={`tracker tr-${i+1}`} />
        ))}
        <div className="hover-card">
          <p className="prompt"></p>
          <div className="hover-title"></div>
          <div className="hover-subtitle"></div>
          <div className="hover-card-content w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HoverCard;