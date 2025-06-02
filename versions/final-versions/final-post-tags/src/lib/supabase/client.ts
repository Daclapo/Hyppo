import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../types/database.types'

export function createClient() {
  // Crear un cliente de Supabase con almacenamiento persistente para sesiones
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Configuración para mejorar la persistencia de sesiones
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
}
