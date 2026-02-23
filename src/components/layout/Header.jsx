import React, { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import { UtensilsCrossed } from 'lucide-react';

export const Header = ({ isEditing }) => {
  const { menuData, setMenuData } = useContext(MenuContext);

  const updateGlobal = (key, value) => {
    setMenuData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="text-center mb-12 relative">
      <div className="inline-block p-4 border-2 border-white/10 rounded-lg bg-neutral-900/50 backdrop-blur-sm">
        <UtensilsCrossed className="w-12 h-12 mx-auto mb-2 text-white" />
        {isEditing ? (
          <input
            value={menuData.restaurantName}
            onChange={(e) => updateGlobal('restaurantName', e.target.value)}
            className="bg-transparent text-4xl font-bold text-center border-b border-white/20 focus:border-cyan-400 outline-none block w-full"
          />
        ) : (
          <h2 className="text-5xl font-bold tracking-tighter">{menuData.restaurantName}</h2>
        )}
        {isEditing ? (
          <input
            value={menuData.subtitle}
            onChange={(e) => updateGlobal('subtitle', e.target.value)}
            className="bg-transparent text-xl font-medium text-center border-b border-white/20 focus:border-pink-400 outline-none block w-full mt-2"
          />
        ) : (
          <p className="text-2xl font-light text-pink-500 italic mt-1">{menuData.subtitle}</p>
        )}
      </div>
    </div>
  );
};