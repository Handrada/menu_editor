import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { PublicMenu } from './pages/PublicMenu';
import { Admin } from './pages/Admin';
import { LayoutEditor } from './pages/LayoutEditor';
import { Login } from './pages/Login'; 
import { MenuContext } from './context/MenuContext';
import { Utensils, Globe } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="bg-zinc-950 min-h-screen" />;
  if (!session) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  const { language, toggleLanguage } = useContext(MenuContext);

  return (
    <BrowserRouter>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-zinc-900 border-b border-white/10 px-6 py-3 flex justify-between items-center print:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-pink-600 p-2 rounded-lg"><Utensils size={18} className="text-white" /></div>
          <span className="text-lg font-black tracking-tighter text-white uppercase">EPAZZOTE</span>
        </Link>

        <button onClick={toggleLanguage} className="bg-zinc-800 px-3 py-2 rounded-xl border border-white/5 text-[10px] font-bold text-white uppercase flex items-center gap-2">
          <Globe size={14} className={language === 'en' ? 'text-cyan-400' : 'text-zinc-500'} />
          {language === 'es' ? 'Español' : 'English'}
        </button>
      </nav>

      <main className="min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<PublicMenu defaultSlug="epazzote" />} />
          <Route path="/r/:restaurantSlug" element={<PublicMenu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/layout" element={<ProtectedRoute><LayoutEditor /></ProtectedRoute>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;