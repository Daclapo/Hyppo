import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../types/database.types'

export function createClient() {
  // No hay que "esperar" a cookies() - es una función síncrona en este contexto
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path: string; maxAge: number; domain?: string; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean }) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: { path: string; domain?: string; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean }) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )
}
