import React from 'react';

export default function GlassCard({ children, className = '', isHero = false, onClick, style = {} }) {
  return (
    <div
      className={`${isHero ? 'hero-glass-card' : 'glass-card'} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
