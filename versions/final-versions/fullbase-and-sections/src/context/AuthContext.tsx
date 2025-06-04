"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: User | null
  session: Session | null
  username: string
  isLoading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [username, setUsername] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true)
      try {
        // Obtener la sesión actual
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error al obtener la sesión:', error)
          return
        }

        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)

          // Obtener el perfil del usuario
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', currentSession.user.id)
            .single()

          if (profile) {
            setUsername(profile.username)
          }
        }
      } catch (err) {
        console.error('Error inesperado al obtener la sesión:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Ejecutar la función al montar el componente
    fetchSession()

    // Configurar escucha de cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event)

      if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession)
        setUser(newSession.user)

        // Obtener el perfil del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', newSession.user.id)
          .single()

        if (profile) {
          setUsername(profile.username)
        }

        // Forzar refresco para actualizar contenido
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setUsername('')
        // Forzar refresco para actualizar contenido
        router.refresh()
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        setSession(newSession)
        setUser(newSession.user)
        // Forzar refresco para actualizar contenido
        router.refresh()
      }
    })

    // Limpiar la suscripción al desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Error al cerrar sesión:', error)
        return
      }

      setSession(null)
      setUser(null)
      setUsername('')
      // Forzar navegación a la página principal después de cerrar sesión
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Error inesperado al cerrar sesión:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      setIsLoading(true)
      const { data: { session: refreshedSession }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error al refrescar la sesión:', error)
        return
      }

      if (refreshedSession) {
        setSession(refreshedSession)
        setUser(refreshedSession.user)

        // Obtener el perfil del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', refreshedSession.user.id)
          .single()

        if (profile) {
          setUsername(profile.username)
        }

        // Forzar refresco para actualizar contenido
        router.refresh()
      }
    } catch (err) {
      console.error('Error inesperado al refrescar la sesión:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    session,
    username,
    isLoading,
    signOut,
    refreshSession
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
