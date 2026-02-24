import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { MenuContext } from '../context/MenuContext';
import { QRGenerator } from '../components/admin/QRGenerator';
import { Button } from '../components/ui/Button';
import { 
  Save, Plus, LogOut, ShieldCheck, 
  UserPlus, Layout as LayoutIcon, Loader2, AlertCircle 
} from 'lucide-react';

export const Admin = () => {
  const navigate = useNavigate();
  const { menuData, setMenuData } = useContext(MenuContext);
  
  // Estados de carga y sesión
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  // Estados para el formulario de Super Admin (Nuevo Cliente)
  const [newRest, setNewRest] = useState({ name: '', slug: '', ownerId: '' });
  const [slugError, setSlugError] = useState('');

  useEffect(() => {
    const initAdmin = async () => {
      // 1. Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // 2. Verificar rol de Super Admin en la tabla 'profiles'
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile?.role === 'super_admin') {
        setIsAdmin(true);
      }

      // 3. Cargar el restaurante que le pertenece a este usuario
      const { data: restData } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (restData) {
        setRestaurant(restData);
        
        // 4. Cargar el menú de ese restaurante
        const { data: menuEntry } = await supabase
          .from('menus')
          .select('data')
          .eq('restaurant_id', restData.id)
          .single();

        if (menuEntry) {
          setMenuData(menuEntry.data);
        }
      }
      setLoading(false);
    };

    initAdmin();
  }, [navigate, setMenuData]);

  // --- Lógica de Validación de Slugs ---
  const checkSlugAvailability = async (slug) => {
    if (!slug) return;
    const { data } = await supabase
      .from('restaurants')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();

    if (data) setSlugError('Esta URL ya está registrada');
    else setSlugError('');
  };

  // --- Acciones de Super Admin ---
  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (slugError) return;

    setSaving(true);
    const { error } = await supabase.rpc('create_restaurant_pack', {
      p_owner_id: newRest.ownerId,
      p_name: newRest.name,
      p_slug: newRest.slug
    });

    if (error) {
      alert("Error técnico: " + error.message);
    } else {
      alert("¡Restaurante y Menú creados con éxito!");
      setNewRest({ name: '', slug: '', ownerId: '' });
    }
    setSaving(false);
  };

  // --- Acciones de Editor ---
  const handleSaveMenu = async () => {
    if (!restaurant) return;
    setSaving(true);
    const { error } = await supabase
      .from('menus')
      .update({ data: menuData })
      .eq('restaurant_id', restaurant.id);

    if (error) alert("Error al guardar: " + error.message);
    else alert("Menú actualizado correctamente");
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="animate-spin text-pink-500" size={32} />
        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Iniciando sistema...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      
      {/* 🛡️ SECCIÓN MASTER DASHBOARD (Solo visible para Horacio) */}
      {isAdmin && (
        <section className="max-w-6xl mx-auto mb-12 bg-pink-900/5 border border-pink-500/20 p-6 md:p-8 rounded-[2rem] shadow-2xl">
          <div className="flex items-center gap-3 mb-8 text-pink-500">
            <div className="bg-pink-500/10 p-2 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tighter">Master Control</h2>
              <p className="text-[9px] text-zinc-500 uppercase">Alta de nuevos clientes Playa del Carmen</p>
            </div>
          </div>
          
          <form onSubmit={handleCreateClient} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <div className="space-y-1">
              <input 
                placeholder="Nombre del Negocio" 
                className="w-full bg-zinc-900 border border-white/5 p-4 rounded-2xl text-xs focus:border-pink-500 outline-none transition-all"
                value={newRest.name}
                onChange={e => setNewRest({...newRest, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <input 
                placeholder="slug-url (ej: el-fogon)" 
                className={`w-full bg-zinc-900 border ${slugError ? 'border-red-500' : 'border-white/5'} p-4 rounded-2xl text-xs focus:border-pink-500 outline-none transition-all`}
                value={newRest.slug}
                onChange={e => {
                  const val = e.target.value.toLowerCase().replace(/\s+/g, '-');
                  setNewRest({...newRest, slug: val});
                  checkSlugAvailability(val);
                }}
                required
              />
              {slugError && <p className="text-[9px] text-red-500 font-bold px-2 flex items-center gap-1 mt-1"><AlertCircle size={10}/> {slugError}</p>}
            </div>
            <input 
              placeholder="User ID del Dueño (UUID)" 
              className="w-full bg-zinc-900 border border-white/5 p-4 rounded-2xl text-xs focus:border-pink-500 outline-none transition-all"
              value={newRest.ownerId}
              onChange={e => setNewRest({...newRest, ownerId: e.target.value})}
              required
            />
            <Button type="submit" disabled={saving || !!slugError} className="h-[52px] bg-white text-black hover:bg-pink-500 hover:text-white text-[10px] font-black uppercase transition-all">
              <UserPlus size={16} className="mr-2"/> Crear Nuevo Pack
            </Button>
          </form>
        </section>
      )}

      {/* 📋 PANEL DE GESTIÓN DE RESTAURANTE */}
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              {restaurant ? restaurant.name : 'Configuración'}
              <span className="bg-zinc-900 text-[10px] px-3 py-1 rounded-full text-zinc-500 border border-white/5">ADMIN</span>
            </h1>
            {restaurant && (
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                URL Pública: <span className="text-zinc-300">/r/{restaurant.slug}</span>
              </p>
            )}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button onClick={handleLogout} className="bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white px-4">
              <LogOut size={18} />
            </Button>
            <Button 
              onClick={handleSaveMenu} 
              disabled={saving || !restaurant}
              className="flex-1 md:flex-none bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 flex gap-2 items-center justify-center rounded-2xl shadow-lg shadow-pink-600/20"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? 'Guardando...' : 'Publicar Cambios'}
            </Button>
          </div>
        </header>

        {restaurant ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Editor de Secciones (Aquí integrarás tus componentes de edición) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-zinc-900 border border-white/5 rounded-[2rem] p-8 min-h-[400px]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Estructura del Menú</h3>
                  <Button className="bg-zinc-800 text-[9px] uppercase font-bold py-2 px-4 rounded-lg">
                    <Plus size={14} className="mr-1" /> Nueva Sección
                  </Button>
                </div>
                
                {/* LÓGICA DE MAPEO DE SECCIONES (Tus componentes MenuSectionEditor) */}
                <p className="text-zinc-600 text-xs italic text-center py-20 uppercase tracking-widest">
                  Panel de edición de platos para {restaurant.name} listo para usar.
                </p>
              </div>
            </div>

            {/* Columna Derecha: Herramientas */}
            <div className="space-y-6">
              <QRGenerator 
                url={`${window.location.origin}/r/${restaurant.slug}`} 
                restaurantName={restaurant.name} 
              />
              
              <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 text-center">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Apariencia Visual</h4>
                <Button 
                  onClick={() => navigate('/layout')}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white flex gap-2 items-center justify-center py-5 rounded-2xl transition-all border border-white/5"
                >
                  <LayoutIcon size={18} className="text-pink-500" /> Personalizar Layout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-white/5 rounded-[2rem] p-20 text-center">
            <p className="text-zinc-500 uppercase text-xs tracking-[0.2em]">No tienes un restaurante asignado todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
};