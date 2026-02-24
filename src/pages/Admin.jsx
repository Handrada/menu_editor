import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { MenuContext } from '../context/MenuContext';
import { QRGenerator } from '../components/admin/QRGenerator';
import { Button } from '../components/ui/Button';
import { Save, LogOut, ShieldCheck, UserPlus, Loader2 } from 'lucide-react';

export const Admin = () => {
  const navigate = useNavigate();
  const { menuData, setMenuData } = useContext(MenuContext);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [newRest, setNewRest] = useState({ name: '', slug: '', ownerId: '' });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role === 'super_admin') setIsAdmin(true);

      const { data: restData } = await supabase.from('restaurants').select('*').eq('owner_id', user.id).single();
      if (restData) {
        setRestaurant(restData);
        const { data: menu } = await supabase.from('menus').select('data').eq('restaurant_id', restData.id).single();
        if (menu) setMenuData(menu.data);
      }
      setLoading(false);
    };
    init();
  }, [setMenuData]);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    const { error } = await supabase.rpc('create_restaurant_pack', {
      p_owner_id: newRest.ownerId, p_name: newRest.name, p_slug: newRest.slug
    });
    if (error) alert(error.message);
    else {
      alert("Cliente creado con éxito");
      setNewRest({ name: '', slug: '', ownerId: '' });
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white italic">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {isAdmin && (
        <section className="max-w-6xl mx-auto mb-12 bg-pink-900/5 border border-pink-500/20 p-8 rounded-[2rem]">
          <div className="flex items-center gap-2 text-pink-500 mb-6"><ShieldCheck size={20}/><h2 className="font-black uppercase text-xs">Panel de Control Maestro</h2></div>
          <form onSubmit={handleCreateClient} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input placeholder="Nombre del Negocio" className="bg-zinc-900 border border-white/5 p-4 rounded-xl text-xs" value={newRest.name} onChange={e => setNewRest({...newRest, name: e.target.value})} required />
            <input placeholder="slug-de-url" className="bg-zinc-900 border border-white/5 p-4 rounded-xl text-xs" value={newRest.slug} onChange={e => setNewRest({...newRest, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} required />
            <input placeholder="ID de Usuario (UUID)" className="bg-zinc-900 border border-white/5 p-4 rounded-xl text-xs" value={newRest.ownerId} onChange={e => setNewRest({...newRest, ownerId: e.target.value})} required />
            <Button type="submit" className="bg-white text-black text-[10px] font-bold">CREAR CLIENTE</Button>
          </form>
        </section>
      )}
      
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter">{restaurant?.name || 'Administración'}</h1>
          <Button onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}><LogOut size={18}/></Button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-[2rem] p-8 text-center py-20 text-zinc-500 text-xs uppercase tracking-widest">
            Editor de platos para {restaurant?.name || 'su negocio'} listo.
          </div>
          <div className="space-y-6">
            {restaurant && <QRGenerator url={`${window.location.origin}/r/${restaurant.slug}`} restaurantName={restaurant.name} />}
          </div>
        </div>
      </div>
    </div>
  );
};