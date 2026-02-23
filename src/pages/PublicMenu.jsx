import React, { useContext, useState, useEffect } from 'react';
import { MenuContext } from '../context/MenuContext';
import { MexicanBorder } from '../components/menu/MexicanBorder';
import { convertPrice } from '../utils/currency';
import { getContrastColor } from '../utils/contrast';
import { UtensilsCrossed, Phone, MapPin, Heart } from 'lucide-react';

export const PublicMenu = () => {
  const { menuData, language } = useContext(MenuContext);
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Lógica del Fade: se muestra 2 segundos y luego se desvanece
  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2000); // Inicia el fade a los 2s
    const removeTimer = setTimeout(() => setShowWelcome(false), 3000); // Desaparece del DOM a los 3s
    
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!menuData || !menuData.printSettings) return null;

  const { gridCols, gap, orientation, backgroundColor } = menuData.printSettings;
  const textColor = getContrastColor(backgroundColor || '#ffffff');
  const isDarkBg = textColor === '#ffffff';

  const t = {
    es: { 
      welcome: "¡Bienvenidos!", 
      sub: "Sabores auténticos de México", 
      loc: "Ubicación", 
      tel: "Teléfono" 
    },
    en: { 
      welcome: "Welcome!", 
      sub: "Authentic Mexican Flavors", 
      loc: "Location", 
      tel: "Phone" 
    }
  }[language];

  const renderModule = (mod) => {
    const sectionData = menuData.sections.find(s => s.id === mod.id);
    const style = { gridColumn: `span ${mod.w}` };

    if (mod.id === 'header') return (
      <header key="h" className="text-center mb-10" style={{ ...style, color: textColor }}>
        <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h1 className="text-6xl font-black uppercase tracking-tighter">{menuData.restaurantName}</h1>
        <p className="text-2xl font-serif italic text-pink-600 mt-2">{menuData.subtitle}</p>
      </header>
    );

    if (mod.id.includes('border')) return (
      <div key={mod.id} style={style} className="py-4">
        <MexicanBorder colorZigZag={mod.color || "#ec4899"} />
      </div>
    );

    if (sectionData) return (
      <div 
        key={mod.id} 
        className={`p-8 rounded-[2.5rem] border transition-all h-fit ${isDarkBg ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-100 shadow-sm'}`}
        style={{ ...style, color: textColor }}
      >
        <h2 className="text-2xl font-black mb-6 uppercase border-b-2 pb-2" style={{ color: sectionData.color, borderBottomColor: sectionData.color }}>
          {sectionData.title}
        </h2>
        <div className="space-y-6">
          {sectionData.items.map(item => (
            <div key={item.id} className="group">
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-sm font-bold uppercase">{language === 'en' ? (item.name_en || item.name) : item.name}</span>
                {item.price && <span className="font-black text-sm" style={{ color: sectionData.color }}>{convertPrice(item.price)}</span>}
              </div>
              {(language === 'en' ? item.description_en : item.description) && (
                <p className={`text-[11px] italic mt-1 leading-relaxed ${isDarkBg ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {language === 'en' ? item.description_en : item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );

    if (mod.id === 'footer') return (
      <footer key="f" className={`mt-12 border-t pt-8 flex justify-between items-center ${isDarkBg ? 'border-white/10 text-zinc-400' : 'border-black/10 text-zinc-500'}`} style={style}>
        <div className="flex items-center gap-3">
          <MapPin size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">{menuData.footerInfo?.location}</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-sm" style={{ color: textColor }}>
          <Phone size={16} className="text-green-500" /> {menuData.footerInfo?.phone}
        </div>
      </footer>
    );
    return null;
  };

  return (
    <div className="relative min-h-screen bg-zinc-200/50 flex justify-center py-16 overflow-x-hidden">
      
      {/* --- OVERLAY DE BIENVENIDA --- */}
      {showWelcome && (
        <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center space-y-4 px-6">
            <UtensilsCrossed className="w-16 h-16 text-pink-500 mx-auto animate-bounce" />
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter">{t.welcome}</h1>
            <div className="h-1 w-20 bg-pink-500 mx-auto rounded-full"></div>
            <p className="text-zinc-400 font-serif italic text-xl">{t.sub}</p>
            <div className="pt-8 flex items-center justify-center gap-2 text-zinc-600">
               <Heart size={12} className="fill-zinc-800" />
               <span className="text-[10px] uppercase tracking-[0.3em]">Epazzote Playa del Carmen</span>
            </div>
          </div>
        </div>
      )}

      {/* --- EL MENÚ REAL --- */}
      <div 
        id="menu-to-print" 
        className="grid shadow-[0_0_100px_rgba(0,0,0,0.2)] p-12 md:p-20 transition-all duration-700" 
        style={{ 
          backgroundColor: backgroundColor || '#ffffff',
          width: orientation === 'landscape' ? '297mm' : '210mm',
          minHeight: orientation === 'landscape' ? '210mm' : '297mm',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: `${gap}px`,
          alignContent: 'start'
        }}
      >
        {menuData.layoutOrder.map(mod => renderModule(mod))}
      </div>
    </div>
  );
};