import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
};