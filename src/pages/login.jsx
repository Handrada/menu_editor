import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Lock, Mail } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error al ingresar: " + error.message);
      setLoading(false);
    } else {
      // Redirección profesional usando el router de React
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo / Título del SaaS */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Panel <span className="text-pink-600">Business</span>
          </h2>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-2">
            Gestión de Menú Digital • Playa del Carmen
          </p>
        </div>

        <form 
          onSubmit={handleLogin} 
          className="bg-zinc-900 p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6"
        >
          <div className="space-y-4">
            {/* Campo Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="email" 
                  required
                  placeholder="ejemplo@hotel.com"
                  className="w-full bg-zinc-800 border border-white/5 rounded-2xl p-4 pl-12 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-white/5 rounded-2xl p-4 pl-12 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-pink-600/20"
          >
            {loading ? 'Validando...' : 'Ingresar al Editor'}
          </Button>

          <p className="text-center text-[9px] text-zinc-600 uppercase tracking-widest">
            ¿Olvidaste tu acceso? Contactá al soporte técnico
          </p>
        </form>
      </div>
    </div>
  );
};