import { createClient } from '@supabase/supabase-js'

// Vite solo reconoce variables que empiecen con VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRÍTICO: No se encontraron las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)