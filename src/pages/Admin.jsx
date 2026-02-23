import React, { useContext, useRef } from 'react';
import { MenuContext } from '../context/MenuContext';
import { MenuSection } from '../components/menu/MenuSection';
import { QRGenerator } from '../components/admin/QRGenerator'; // El nuevo componente
import { Button } from '../components/ui/Button';
import { exportPDF } from '../utils/exportPDF';
import { exportJSON } from '../utils/exportJSON';
import { 
  MapPin, Phone, Info, Download, Upload, 
  Plus, Layout as LayoutIcon, Globe, Settings2 
} from 'lucide-react';

export const Admin = () => {
  const { 
    menuData, updateHeader, updateFooter, importMenuData, 
    isEditing, setIsEditing, addSection, updateItem, 
    deleteItem, addItem, updatePrintSettings, language
  } = useContext(MenuContext);

  const fileInputRef = useRef(null);

  // Manejador para importar backups (JSON)
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importMenuData(json);
      } catch (err) {
        alert("Error técnico: El archivo JSON es inválido o está corrupto.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24 pb-32 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- NIVEL 1: IDENTIDAD + QR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* IDENTIDAD VISUAL */}
          <div className="lg:col-span-2 bg-zinc-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center gap-2 text-pink-500 border-b border-white/5 pb-4">
              <Settings2 size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Configuración de Marca</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 italic">Nombre del Negocio</label>
                  <input type="text" value={menuData.restaurantName} onChange={(e) => updateHeader('restaurantName', e.target.value)}
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xl font-black uppercase text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 italic">Eslogan (Marketing)</label>
                  <input type="text" value={menuData.subtitle} onChange={(e) => updateHeader('subtitle', e.target.value)}
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-pink-500 italic focus:ring-2 focus:ring-pink-500 transition-all outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 flex items-center gap-1"><MapPin size={10}/> Playa del Carmen Localización</label>
                  <input type="text" value={menuData.footerInfo?.location || ''} onChange={(e) => updateFooter('location', e.target.value)}
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-cyan-500 transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 flex items-center gap-1"><Phone size={10}/> Teléfono Delivery / Reserva</label>
                  <input type="text" value={menuData.footerInfo?.phone || ''} onChange={(e) => updateFooter('phone', e.target.value)}
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-cyan-500 transition-all outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* GENERADOR DE QR */}
          <div className="lg:col-span-1">
            <QRGenerator 
              url={window.location.origin + "/menu"} 
              restaurantName={menuData.restaurantName}
            />
          </div>
        </div>

        {/* --- NIVEL 2: AJUSTES DE HOJA Y PDF --- */}
        <div className="bg-zinc-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 mb-6 border-b border-white/5 pb-4">
            <LayoutIcon size={18} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Parámetros de Impresión</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Fondo de Hoja</label>
              <div className="flex items-center gap-4 bg-black border border-white/10 p-3 rounded-2xl">
                <input type="color" value={menuData.printSettings?.backgroundColor || '#ffffff'} onChange={(e) => updatePrintSettings('backgroundColor', e.target.value)}
                  className="w-10 h-10 bg-transparent border-none cursor-pointer" />
                <span className="text-xs font-mono text-zinc-400">{menuData.printSettings?.backgroundColor || '#ffffff'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Orientación</label>
              <div className="flex bg-black p-1 rounded-xl border border-white/10">
                <button onClick={() => updatePrintSettings('orientation', 'portrait')} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${menuData.printSettings.orientation === 'portrait' ? 'bg-white text-black' : 'text-zinc-500'}`}>VERTICAL</button>
                <button onClick={() => updatePrintSettings('orientation', 'landscape')} className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${menuData.printSettings.orientation === 'landscape' ? 'bg-white text-black' : 'text-zinc-500'}`}>HORIZONTAL</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Columnas (Grid)</label>
              <select value={menuData.printSettings.gridCols} onChange={(e) => updatePrintSettings('gridCols', parseInt(e.target.value))}
                className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs font-bold text-white outline-none">
                <option value={1}>1 COLUMNA (CLÁSICO)</option>
                <option value={2}>2 COLUMNAS (MODERNO)</option>
                <option value={3}>3 COLUMNAS (COMPACTO)</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={() => exportPDF('menu-to-print', menuData.printSettings)} className="w-full bg-white text-black font-black uppercase tracking-tighter shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Generar PDF Final
              </Button>
            </div>
          </div>
        </div>

        {/* --- NIVEL 3: BARRA FLOTANTE Y EDITOR DE PLATOS --- */}
        <div className="sticky top-20 z-[100] flex justify-between items-center bg-zinc-900/90 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
           <div className="flex gap-3">
             <Button onClick={() => setIsEditing(!isEditing)} className={`px-8 text-[10px] font-black tracking-widest ${isEditing ? 'bg-pink-600 ring-4 ring-pink-500/20' : 'bg-zinc-800'}`}>
               {isEditing ? 'GUARDAR CAMBIOS' : 'EDITAR PLATILLOS'}
             </Button>
             <Button onClick={addSection} className="bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold">+ SECCIÓN</Button>
           </div>
           
           <div className="flex gap-2">
              <label className="bg-zinc-800 p-3 rounded-xl cursor-pointer hover:bg-cyan-500/20 transition-all border border-white/5" title="Importar Backup">
                <Upload size={18} className="text-cyan-400" />
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImport} accept=".json" />
              </label>
              <button onClick={() => exportJSON(menuData)} className="bg-zinc-800 p-3 rounded-xl hover:bg-cyan-500/20 border border-white/5" title="Exportar Backup">
                <Download size={18} className="text-cyan-400" />
              </button>
           </div>
        </div>

        {/* LISTADO DE SECCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menuData.sections.map(section => (
            <MenuSection 
              key={section.id} section={section} isEditing={isEditing} 
              updateItem={updateItem} deleteItem={deleteItem} addItem={addItem} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};