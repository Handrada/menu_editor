import React, { createContext, useState, useEffect } from 'react';
import { INITIAL_MENU_DATA } from '../data/initialMenuData';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState(() => {
    // Mantenemos la key para no perder tus datos cargados
    const saved = localStorage.getItem('epazzote_ultimate_grid');
    return saved ? JSON.parse(saved) : INITIAL_MENU_DATA;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [language, setLanguage] = useState('es'); // 'es' o 'en'

  // Persistencia automática en el navegador
  useEffect(() => {
    localStorage.setItem('epazzote_ultimate_grid', JSON.stringify(menuData));
  }, [menuData]);

  // --- LÓGICA DE IDIOMAS ---
  const toggleLanguage = () => setLanguage(prev => prev === 'es' ? 'en' : 'es');

  // --- IDENTIDAD (HEADER / FOOTER) ---
  const updateHeader = (field, value) => setMenuData(prev => ({ ...prev, [field]: value }));
  
  const updateFooter = (field, value) => setMenuData(prev => ({
    ...prev, 
    footerInfo: { ...prev.footerInfo, [field]: value }
  }));

  // --- SECCIONES E ITEMS (BILINGÜE) ---
  const addSection = () => {
    const newId = `sec-${Date.now()}`;
    const newSection = { 
      id: newId, 
      title: "NUEVA SECCIÓN", 
      color: "#ec4899", 
      items: [] 
    };
    const newBlock = { id: newId, w: 1 };
    
    setMenuData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      layoutOrder: [
        ...prev.layoutOrder.filter(item => item.id !== 'footer'),
        newBlock,
        ...prev.layoutOrder.filter(item => item.id === 'footer')
      ]
    }));
  };

  const updateSectionTitle = (id, title) => setMenuData(prev => ({
    ...prev, sections: prev.sections.map(s => s.id === id ? { ...s, title } : s)
  }));

  const updateSectionColor = (id, color) => setMenuData(prev => ({
    ...prev, sections: prev.sections.map(s => s.id === id ? { ...s, color } : s)
  }));

  const addItem = (secId) => {
    const newItem = { 
      id: `it-${Date.now()}`, 
      name: "Nuevo Plato", 
      name_en: "New Dish", 
      price: "", 
      description: "", 
      description_en: "" 
    };
    setMenuData(prev => ({
      ...prev, 
      sections: prev.sections.map(s => s.id === secId ? { ...s, items: [...s.items, newItem] } : s)
    }));
  };

  const updateItem = (secId, itemId, field, val) => setMenuData(prev => ({
    ...prev, 
    sections: prev.sections.map(s => s.id === secId ? { 
      ...s, 
      items: s.items.map(i => i.id === itemId ? { ...i, [field]: val } : i) 
    } : s)
  }));

  const deleteItem = (secId, itemId) => setMenuData(prev => ({
    ...prev, 
    sections: prev.sections.map(s => s.id === secId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s)
  }));

  // --- GESTIÓN DE BORDES Y LAYOUT ---
  const addBorder = () => {
    const newId = `border-${Date.now()}`;
    const newBorder = { 
      id: newId, 
      w: menuData.printSettings.gridCols, 
      type: 'mexican-wave', 
      color: '#ec4899' 
    };
    setMenuData(prev => ({
      ...prev,
      layoutOrder: [
        ...prev.layoutOrder.filter(item => item.id !== 'footer'),
        newBorder,
        ...prev.layoutOrder.filter(item => item.id === 'footer')
      ]
    }));
  };

  const updateBorderSettings = (id, field, value) => setMenuData(prev => ({
    ...prev, 
    layoutOrder: prev.layoutOrder.map(m => m.id === id ? { ...m, [field]: value } : m)
  }));

  const updateLayout = (newOrder) => setMenuData(prev => ({ ...prev, layoutOrder: newOrder }));

  const updateBlockWidth = (id, w) => setMenuData(prev => ({
    ...prev, 
    layoutOrder: prev.layoutOrder.map(m => m.id === id ? { ...m, w: parseInt(w) } : m)
  }));

  const deleteBlock = (id) => setMenuData(prev => ({
    ...prev,
    layoutOrder: prev.layoutOrder.filter(m => m.id !== id),
    sections: prev.sections.filter(s => s.id !== id)
  }));

  // --- CONFIGURACIÓN DE IMPRESIÓN ---
  const updatePrintSettings = (field, value) => setMenuData(prev => ({
    ...prev, 
    printSettings: { ...prev.printSettings, [field]: value }
  }));

  // --- BACKUP / IMPORTACIÓN ---
  const importMenuData = (newData) => setMenuData(newData);

  return (
    <MenuContext.Provider value={{ 
      menuData, isEditing, setIsEditing, language, toggleLanguage,
      updateHeader, updateFooter, importMenuData,
      addSection, updateSectionTitle, updateSectionColor, 
      addItem, updateItem, deleteItem,
      addBorder, updateBorderSettings, 
      updateLayout, updateBlockWidth, deleteBlock, 
      updatePrintSettings 
    }}>
      {children}
    </MenuContext.Provider>
  );
};