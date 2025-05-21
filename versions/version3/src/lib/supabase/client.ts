import { createClient } from '@supabase/supabase-js';

// Asegúrate de que estas variables estén definidas en tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las variables de entorno de Supabase. Por favor, comprueba tu archivo .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
