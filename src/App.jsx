import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { PublicMenu } from './pages/PublicMenu';
import { Admin } from './pages/Admin';
import { LayoutEditor } from './pages/LayoutEditor';
import { MenuContext } from './context/MenuContext';
import { Utensils, Globe } from 'lucide-react';

const App = () => {
  const { language, toggleLanguage } = useContext(MenuContext);

  return (
    <BrowserRouter>
      {/* Navbar simplificada para el cliente */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-zinc-900 border-b border-white/10 px-6 py-3 flex justify-between items-center print:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-pink-600 p-2 rounded-lg"><Utensils size={18} className="text-white" /></div>
          <span className="text-lg font-black tracking-tighter text-white uppercase">EPAZZOTE</span>
        </Link>

        <div className="flex gap-4 items-center">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-xl border border-white/5 transition-all"
          >
            <Globe size={14} className={language === 'en' ? 'text-cyan-400' : 'text-zinc-500'} />
            <span className="text-[10px] font-bold text-white uppercase">
              {language === 'es' ? 'Español' : 'English'}
            </span>
          </button>
          {/* Eliminamos los links de Editor y Layout de aquí para que el cliente no los vea */}
        </div>
      </nav>

      <main className="min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<PublicMenu />} />
          <Route path="/r/:restaurantSlug" element={<PublicMenu />} />
          <Route path="/login" element={<Login />} /> {/* <--- Esta es la nueva puerta */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/layout" element={<LayoutEditor />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
