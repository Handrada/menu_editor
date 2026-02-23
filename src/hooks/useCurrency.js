import { useLocalStorage } from './useLocalStorage';

export const useCurrency = () => {
  const [currency, setCurrency] = useLocalStorage('currency', 'MXN');

  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'MXN' ? 'USD' : 'MXN'));
  };

  return { currency, toggleCurrency };
};