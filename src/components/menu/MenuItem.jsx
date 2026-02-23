import React from 'react';
import { Trash2 } from 'lucide-react';

export const MenuItem = ({ item, sectionId, isEditing, updateItem, deleteItem }) => {
  return (
    <div className="relative group/item border-b border-white/5 pb-4 last:border-0">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-2">
              <input 
                value={item.name}
                onChange={(e) => updateItem(sectionId, item.id, 'name', e.target.value.toUpperCase())}
                className="bg-neutral-800 p-1 w-full text-sm font-bold border border-white/10"
              />
              <textarea 
                value={item.description}
                onChange={(e) => updateItem(sectionId, item.id, 'description', e.target.value)}
                className="bg-neutral-800 p-1 w-full text-xs text-neutral-400 h-16 border border-white/10"
              />
            </div>
          ) : (
            <>
              <h4 className="text-sm font-bold leading-tight group-hover/item:text-cyan-400 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-neutral-400 italic mt-1 leading-relaxed">
                {item.description}
              </p>
            </>
          )}
        </div>
        <div className="text-right">
          {isEditing ? (
            <div className="flex flex-col gap-2 items-end">
              <input 
                type="number"
                value={item.price}
                onChange={(e) => updateItem(sectionId, item.id, 'price', e.target.value)}
                className="bg-neutral-800 p-1 w-20 text-right text-pink-400 font-bold border border-white/10"
              />
              <button 
                onClick={() => deleteItem(sectionId, item.id)}
                className="text-red-500 hover:text-red-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-pink-500 font-bold text-lg">
              ${parseFloat(item.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};