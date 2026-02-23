import React from 'react';

export const MexicanBorder = ({ 
  colorZigZag = "#ec4899", // Rosa Mexicano
  colorDotsTop = "#22d3ee", // Cian
  colorDotsBottom = "#facc15" // Amarillo/Naranja
}) => {
  return (
    <div className="w-full overflow-hidden h-8 my-2">
      <svg width="100%" height="30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Definimos el patrón que se va a repetir */}
          <pattern id="mexicanPattern" x="0" y="0" width="40" height="30" patternUnits="userSpaceOnUse">
            
            {/* Puntos Superiores (Cian) */}
            <circle cx="20" cy="6" r="3" fill={colorDotsTop} />
            
            {/* El Zig-Zag (Rosa) */}
            <path 
              d="M0 20 L10 10 L20 20 L30 10 L40 20" 
              fill="none" 
              stroke={colorZigZag} 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            
            {/* Puntos Inferiores (Naranja) */}
            <circle cx="10" cy="24" r="3" fill={colorDotsBottom} />
            <circle cx="30" cy="24" r="3" fill={colorDotsBottom} />
            
          </pattern>
        </defs>
        
        {/* Dibujamos un rectángulo que usa ese patrón */}
        <rect width="100%" height="100%" fill="url(#mexicanPattern)" />
      </svg>
    </div>
  );
};