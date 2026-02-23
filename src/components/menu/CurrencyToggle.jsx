import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { Button } from '../ui/Button';

export const CurrencyToggle = () => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <Button onClick={toggleCurrency}>
      Cambiar Moneda ({currency})
    </Button>
  );
};