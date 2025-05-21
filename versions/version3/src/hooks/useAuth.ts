"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  function getFriendlyAuthError(error: any) {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message?.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.';
    if (error.message?.includes('User already registered')) return 'El usuario ya está registrado.';
    if (error.message?.includes('rate limit')) return 'Demasiados intentos. Intenta de nuevo más tarde.';
    return 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
  }

  useEffect(() => {
    // Obtener la sesión actual
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'Usuario',
            created_at: new Date().toISOString(),
            user_metadata: session.user.user_metadata
          };
          setUser(userData);

          // Obtener datos adicionales del usuario desde la tabla users si existe
          try {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userData) {
              setUser(prevUser => ({
                ...prevUser as User,
                ...userData
              }));
            }
          } catch (error) {
            console.error('Error al obtener datos de usuario:', error);
          }
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthError(null);

        if (session) {
          try {
            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'Usuario',
              created_at: new Date().toISOString(),
              user_metadata: session.user.user_metadata
            };
            setUser(userData);

            // Obtener datos adicionales del usuario
            const { data: additionalUserData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (additionalUserData) {
              setUser(prevUser => ({
                ...prevUser as User,
                ...additionalUserData
              }));
            }
          } catch (error) {
            console.error('Error al actualizar usuario:', error);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || ''
          }
        }
      });

      if (error) {
        setAuthError(getFriendlyAuthError(error));
        return { user: null, error };
      }

      // Crear un registro en la tabla de usuarios personalizada
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          username: email.split('@')[0],
          name: name || ''
        });
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      setAuthError(getFriendlyAuthError(error));
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setAuthError(getFriendlyAuthError(error));
      }

      return { user: data.user, error };
    } catch (error: any) {
      setAuthError(getFriendlyAuthError(error));
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthError(getFriendlyAuthError(error));
      }
      setUser(null);
      return { error };
    } catch (error: any) {
      setAuthError(getFriendlyAuthError(error));
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user, error } = await signIn(email, password);
    return !error;
  };

  const logout = async () => {
    return await signOut();
  };

  return {
    user,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    login,
    logout,
    isAuthenticated: !!user
  };
}

// Asegurarnos de exportar correctamente la función
export default useAuth;
