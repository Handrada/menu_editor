// src/utils/contrast.js

export const getContrastColor = (hexColor) => {
  if (!hexColor) return '#18181b'; // zinc-900 por defecto

  // Quitamos el # si existe
  const hex = hexColor.replace('#', '');
  
  // Convertimos a RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Fórmula de luminosidad (estándar de la industria)
  // Y = 0.299R + 0.587G + 0.114B
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Si la luminosidad es alta (color claro), devolvemos texto oscuro. 
  // Si es baja (color oscuro), devolvemos texto blanco.
  return brightness > 128 ? '#18181b' : '#ffffff';
};