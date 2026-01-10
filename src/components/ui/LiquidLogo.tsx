'use client';

import React from 'react';

interface LiquidLogoProps {
  src?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}

export function LiquidLogo({ src, alt, className = 'h-8 w-auto', children }: LiquidLogoProps) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      {src ? (
        <img
          src={src}
          alt={alt || 'Logo'}
          className="w-full h-full object-contain"
        />
      ) : (
        children
      )}
    </div>
  );
}