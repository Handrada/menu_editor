import React, { useContext } from 'react';
import { MenuContext } from '../context/MenuContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Plus, Palette, Maximize2 } from 'lucide-react';

export const LayoutEditor = () => {
  const { menuData, updateLayout, updateBlockWidth, deleteBlock, updateBorderSettings, addBorder, addSection, updatePrintSettings } = useContext(MenuContext);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(menuData.layoutOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateLayout(items);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex pt-16">
      <div className="w-80 bg-zinc-900 border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto">
        <h2 className="text-xl font-black uppercase text-pink-500 italic tracking-tighter">Maquetador</h2>

        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase text-zinc-500">Ajustes de Hoja</label>
          <div className="flex gap-2">
            <button onClick={() => updatePrintSettings('orientation', 'portrait')} className={`flex-1 py-2 rounded text-[10px] font-bold ${menuData.printSettings.orientation === 'portrait' ? 'bg-pink-600' : 'bg-zinc-800'}`}>VERTICAL</button>
            <button onClick={() => updatePrintSettings('orientation', 'landscape')} className={`flex-1 py-2 rounded text-[10px] font-bold ${menuData.printSettings.orientation === 'landscape' ? 'bg-cyan-600' : 'bg-zinc-800'}`}>HORIZONTAL</button>
          </div>
          <select value={menuData.printSettings.gridCols} onChange={(e) => updatePrintSettings('gridCols', parseInt(e.target.value))} className="w-full bg-black border border-white/10 p-2 rounded text-xs">
            <option value={1}>1 Columna</option>
            <option value={2}>2 Columnas</option>
            <option value={3}>3 Columnas</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
           <button onClick={addSection} className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2 border border-white/5 transition-all">
             <Plus size={14} /> Nueva Sección
           </button>
           <button onClick={addBorder} className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2 border border-white/5 transition-all">
             <Palette size={14} /> Añadir Borde
           </button>
        </div>

        <hr className="border-white/5" />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {menuData.layoutOrder.map((mod, index) => (
                  <Draggable key={mod.id} draggableId={mod.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} className="bg-black/40 p-3 rounded-xl border border-white/5 group">
                        <div className="flex items-center justify-between mb-2">
                          <div {...provided.dragHandleProps} className="flex items-center gap-2">
                            <GripVertical size={14} className="text-zinc-600" />
                            <span className="text-[10px] font-black uppercase text-zinc-400">{mod.id.split('-')[0]}</span>
                          </div>
                          <button onClick={() => deleteBlock(mod.id)} className="text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <select value={mod.w} onChange={(e) => updateBlockWidth(mod.id, e.target.value)} className="bg-zinc-900 text-[9px] border-none rounded px-2">
                             {[1,2,3].map(v => <option key={v} value={v} disabled={v > menuData.printSettings.gridCols}>Ancho {v}</option>)}
                           </select>

                           {mod.id.includes('border') && (
                             <div className="flex gap-2">
                               <input type="color" value={mod.color || '#ec4899'} onChange={(e) => updateBorderSettings(mod.id, 'color', e.target.value)} className="w-5 h-5 bg-transparent border-none cursor-pointer" />
                               <select value={mod.type} onChange={(e) => updateBorderSettings(mod.id, 'type', e.target.value)} className="bg-zinc-900 text-[9px] border-none rounded px-1">
                                 <option value="mexican-wave">Ondas</option>
                                 <option value="dots">Puntos</option>
                                 <option value="zigzag">ZigZag</option>
                               </select>
                             </div>
                           )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="flex-1 bg-black p-12 overflow-auto flex justify-center items-start">
        <div 
          className="bg-white shadow-2xl transition-all duration-500 grid p-16 origin-top scale-[0.6] lg:scale-[0.8]"
          style={{ 
            width: menuData.printSettings.orientation === 'portrait' ? '210mm' : '297mm',
            minHeight: menuData.printSettings.orientation === 'portrait' ? '297mm' : '210mm',
            gridTemplateColumns: `repeat(${menuData.printSettings.gridCols}, 1fr)`,
            gap: `${menuData.printSettings.gap}px`,
            alignContent: 'start'
          }}
        >
          {menuData.layoutOrder.map(mod => (
            <div key={mod.id} className="border border-dashed border-zinc-200 flex items-center justify-center min-h-[60px]" style={{ gridColumn: `span ${mod.w}` }}>
              <span className="text-[9px] font-black uppercase text-zinc-300">{mod.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};