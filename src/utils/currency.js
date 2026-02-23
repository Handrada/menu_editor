// src/utils/currency.js

/**
 * Convierte un valor a formato de moneda local.
 * Maneja errores de tipo de dato (Strings vs Numbers).
 */
export const convertPrice = (price, currency = 'MXN') => {
  // Forzamos que el precio sea un número real. 
  // Si el usuario deja el campo vacío o pone texto, usamos 0.
  const numericPrice = parseFloat(price) || 0;

  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  } catch (error) {
    // Fallback en caso de que falle el formateador internacional
    return `$${numericPrice.toFixed(2)}`;
  }
};