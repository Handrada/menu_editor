import React, { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import { MenuItem } from './MenuItem';
import { Plus, Palette, Trash2 } from 'lucide-react';

export const MenuSection = ({ section, isEditing, updateItem, deleteItem, addItem }) => {
  const { updateSectionColor, updateSectionTitle, deleteSection } = useContext(MenuContext);

  return (
    <div className="relative group mb-10">
      <div className="flex justify-center -mb-4 relative z-10">
        <div 
          className="relative px-8 py-2 transform skew-x-[-15deg] shadow-xl transition-all"
          style={{ backgroundColor: section.color }}
        >
          <div className="transform skew-x-[15deg] flex items-center gap-3">
            {isEditing ? (
              <input 
                type="text"
                value={section.title}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                className="bg-transparent text-white font-black text-lg uppercase tracking-widest border-none outline-none w-40"
              />
            ) : (
              <h3 className="text-white font-black text-lg tracking-widest uppercase">{section.title}</h3>
            )}
            
            {isEditing && (
              <div className="flex gap-2 items-center bg-black/20 rounded-full px-2 py-1">
                <input 
                  type="color" 
                  value={section.color}
                  onChange={(e) => updateSectionColor(section.id, e.target.value)}
                  className="w-4 h-4 bg-transparent border-none cursor-pointer p-0"
                />
                <button onClick={() => deleteSection(section.id)} className="text-white/50 hover:text-white">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border-l-4 p-6 pt-10 rounded-br-3xl" style={{ borderLeftColor: section.color }}>
        <div className="space-y-4">
          {section.items.map(item => (
            <MenuItem key={item.id} item={item} sectionId={section.id} isEditing={isEditing} updateItem={updateItem} deleteItem={deleteItem} />
          ))}
        </div>
        {isEditing && (
          <button onClick={() => addItem(section.id)} className="w-full mt-6 py-2 border border-dashed border-white/20 rounded-lg text-xs uppercase font-bold text-zinc-500 hover:text-white">
            + Añadir Platillo
          </button>
        )}
      </div>
    </div>
  );
};