"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Interfaz para el usuario según tu aplicación
interface User {
  id?: string;
  name?: string;
  email?: string;
  // Otros campos que necesites
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión actual
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || 'Usuario'
        };
        setUser(userData);
      }
      setLoading(false);
    };

    getInitialSession();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 'Usuario'
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    return { user: data.user, error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { user: data.user, error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    return { error };
  };

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      return true;
    }
    return false;
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return { user, loading, signUp, signIn, signOut, login, logout, isAuthenticated: !!user };
}

// Asegurarnos de exportar correctamente la función
export default useAuth;
