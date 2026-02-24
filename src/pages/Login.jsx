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
    if (error) { alert(error.message); setLoading(false); }
    else { navigate('/admin'); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter text-center">Admin <span className="text-pink-600">Login</span></h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-zinc-800 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full bg-zinc-800 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500" onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full bg-pink-600 text-white font-black py-4 rounded-2xl uppercase text-[11px]">{loading ? '...' : 'Entrar'}</Button>
        </form>
      </div>
    </div>
  );
};