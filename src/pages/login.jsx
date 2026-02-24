import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
    else window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-3xl border border-white/5 w-full max-w-md">
        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter text-center">Acceso Admin</h2>
        <input 
          type="email" placeholder="Email"
          className="w-full bg-zinc-800 border border-white/10 rounded-xl p-3 text-white mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Contraseña"
          className="w-full bg-zinc-800 border border-white/10 rounded-xl p-3 text-white mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full bg-pink-600 text-white font-bold py-4">Ingresar</Button>
      </form>
    </div>
  );
};