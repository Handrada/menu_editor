import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Mail, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter text-center italic">Acceso Admin</h2>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] text-center mb-8">Gestión de Menús</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="email" placeholder="Email"
              className="w-full bg-zinc-800 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-pink-500 transition-all"
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="password" placeholder="Contraseña"
              className="w-full bg-zinc-800 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-pink-500 transition-all"
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-pink-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-600/20 uppercase tracking-widest text-[11px]">
            {loading ? 'Cargando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
};