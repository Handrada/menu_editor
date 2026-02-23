import React from 'react';

export const Button = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-bold transition-all ${className}`}
    >
      {children}
    </button>
  );
};