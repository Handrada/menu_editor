import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MenuSection } from '../components/menu/MenuSection';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const PublicMenu = ({ defaultSlug }) => {
  // 1. Obtenemos el slug de la URL (ej: /r/epazzote)
  const { restaurantSlug } = useParams();
  const slug = restaurantSlug || defaultSlug || 'epazzote';

  const [menuData, setMenuData] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurantAndMenu = async () => {
      setLoading(true);
      
      // 2. Buscamos el restaurante por su slug
      const { data: restaurant, error: restError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .single();

      if (restError || !restaurant) {
        console.error("Restaurante no encontrado");
        setLoading(false);
        return;
      }

      setRestaurantInfo(restaurant);

      // 3. Buscamos el menú vinculado a ese restaurante
      const { data: menu, error: menuError } = await supabase
        .from('menus')
        .select('data')
        .eq('restaurant_id', restaurant.id)
        .single();

      if (menu) {
        setMenuData(menu.data);
      }
      
      setLoading(false);
    };

    loadRestaurantAndMenu();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!restaurantInfo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white p-6 text-center">
        <div>
          <h1 className="text-4xl font-black mb-4 uppercase">404</h1>
          <p className="text-zinc-500 uppercase tracking-widest text-xs">Restaurante no encontrado en Playa del Carmen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950" style={{ '--primary-color': restaurantInfo.theme_settings?.primary || '#ec4893' }}>
      <Header name={restaurantInfo.name} logo={restaurantInfo.logo_url} />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {menuData && menuData.length > 0 ? (
          menuData.map((section, index) => (
            <MenuSection key={index} section={section} />
          ))
        ) : (
          <p className="text-center text-zinc-500 py-20 uppercase text-[10px] tracking-[0.2em]">
            El menú se está preparando...
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};