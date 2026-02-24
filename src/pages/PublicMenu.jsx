import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Header } from '../components/layout/Header';
import { MenuSection } from '../components/menu/MenuSection';

export const PublicMenu = ({ defaultSlug }) => {
  const { restaurantSlug } = useParams();
  const slug = restaurantSlug || defaultSlug || 'epazzote';
  const [menuData, setMenuData] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: res } = await supabase.from('restaurants').select('*').eq('slug', slug).single();
      if (res) {
        setRestaurant(res);
        const { data: m } = await supabase.from('menus').select('data').eq('restaurant_id', res.id).single();
        if (m) setMenuData(m.data);
      }
      setLoading(false);
    };
    loadData();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Cargando menú...</div>;
  if (!restaurant) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white uppercase text-xs tracking-widest italic">Restaurante no encontrado</div>;

  return (
    <div className="min-h-screen bg-zinc-950" style={{ '--primary-color': restaurant.theme_settings?.primary || '#ec4893' }}>
      <Header name={restaurant.name} />
      <main className="container mx-auto px-4 py-8 space-y-12">
        {menuData?.map((section, index) => (
          <MenuSection key={index} section={section} />
        ))}
      </main>
    </div>
  );
};