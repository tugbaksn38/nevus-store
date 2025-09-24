// components/AnimatedButton.jsx
// components/AnimatedButton.jsx
'use client';

import Link from 'next/link';
import './AnimatedButton.css';

const AnimatedButton = ({ 
  href, 
  children, 
  onClick, 
  type = 'button',
  className = '',
  target = '_self'
}) => {
  // Buton içeriği
  const buttonContent = (
    <button 
      type={type} 
      onClick={onClick} 
      className={`animated-button ${className}`}
    >
      <span>{children}</span>
    </button>
  );

  // Eğer href varsa ve target _blank ise normal <a> etiketi kullan
  if (href && target === '_blank') {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {buttonContent}
      </a>
    );
  }
  
  // Eğer href varsa Link ile sarmala (legacyBehavior olmadan)
  if (href) {
    return (
      <Link href={href} passHref className="inline-block">
        {buttonContent}
      </Link>
    );
  }
  
  // Href yoksa sadece butonu döndür
  return buttonContent;
};

export default AnimatedButton;