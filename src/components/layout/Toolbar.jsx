import React from 'react';
import { Edit3, Eye, Settings } from 'lucide-react';

export const Toolbar = ({ isEditing, setIsEditing }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-900 border-b border-neutral-800 p-3 flex justify-between items-center shadow-xl">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-pink-500" />
        <h1 className="font-bold text-sm tracking-widest uppercase">Editor de Menú</h1>
      </div>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${isEditing ? 'bg-pink-600 hover:bg-pink-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
      >
        {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
        <span>{isEditing ? 'Ver Vista Previa' : 'Activar Modo Edición'}</span>
      </button>
    </div>
  );
};