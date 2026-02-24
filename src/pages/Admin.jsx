import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { MenuContext } from '../context/MenuContext';
import { QRGenerator } from '../components/admin/QRGenerator';
import { Button } from '../components/ui/Button';
import { Save, Plus, Trash2, Layout as LayoutIcon, LogOut } from 'lucide-react';

export const Admin = () => {
  const navigate = useNavigate();
  const { menuData, setMenuData } = useContext(MenuContext);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkUserAndLoadData = async () => {
      // 1. Verificamos si hay un usuario logueado
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      // 2. Buscamos el restaurante que le pertenece a este usuario
      const { data: restData, error: restError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (restError || !restData) {
        console.error("No se encontró restaurante para este usuario");
        setLoading(false);
        return;
      }

      setRestaurant(restData);

      // 3. Traemos el menú de ese restaurante
      const { data: menuEntry, error: menuError } = await supabase
        .from('menus')
        .select('data')
        .eq('restaurant_id', restData.id)
        .single();

      if (menuEntry) {
        setMenuData(menuEntry.data);
      }
      
      setLoading(false);
    };

    checkUserAndLoadData();
  }, [navigate, setMenuData]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('menus')
      .update({ data: menuData })
      .eq('restaurant_id', restaurant.id);

    if (error) alert("Error al guardar: " + error.message);
    else alert("¡Menú de " + restaurant.name + " actualizado con éxito!");
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
    </div>
  );

  if (!restaurant) return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 text-center">
      <div>
        <h2 className="text-xl font-bold mb-2 uppercase">Configuración Incompleta</h2>
        <p className="text-zinc-500 text-sm">Tu usuario no tiene un restaurante asignado todavía.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 pb-24">
      {/* Header del Admin */}
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Panel: {restaurant.name}</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">ID del Negocio: {restaurant.slug}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleLogout} className="bg-zinc-800 text-zinc-400 hover:text-white p-3">
            <LogOut size={18} />
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 font-bold flex gap-2 items-center"
          >
            <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lógica del Editor (Izquierda/Centro) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
            <h3 className="text-sm font-bold uppercase mb-6 flex items-center gap-2">
              <Plus size={16} className="text-pink-500" /> Gestionar Secciones
            </h3>
            {/* Aquí va tu lógica actual de edición de platos y secciones */}
            <p className="text-zinc-500 text-xs italic">Usa los botones de edición para modificar tus platos de {restaurant.name}.</p>
          </div>
        </div>

        {/* Herramientas (Derecha) */}
        <div className="space-y-6">
          {/* Generador de QR dinámico para este restaurante específico */}
          <QRGenerator 
            url={`${window.location.origin}/r/${restaurant.slug}`} 
            restaurantName={restaurant.name} 
          />
          
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 text-center">Configuración Visual</h4>
            <Button 
              onClick={() => navigate('/layout')}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white flex gap-2 items-center justify-center py-4 rounded-2xl"
            >
              <LayoutIcon size={16} /> Editar Diseño
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};