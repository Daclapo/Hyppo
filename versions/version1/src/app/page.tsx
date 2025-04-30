'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user || null);
        }
      );

      return () => subscription.unsubscribe();
    };

    checkUser();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*');

        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        console.error('Error cargando categorías:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Revisa tu email para confirmar tu cuenta!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Bienvenido al Foro Hippo</h1>

      {!user ? (
        <div className="auth-form">
          <h2>{isSignUp ? 'Registrarse' : 'Iniciar Sesión'}</h2>
          <form onSubmit={handleAuth}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={authLoading}>
              {authLoading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'transparent', border: 'none', marginTop: '1rem', color: '#0070f3', cursor: 'pointer' }}>
            {isSignUp ? 'Ya tienes una cuenta? Inicia Sesión' : 'No tienes una cuenta? Regístrate'}
          </button>
        </div>
      ) : (
        <div className="forum-content">
          <div className="user-info">
            <p>Conectado como: {user.email}</p>
            <button onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
          </div>

          <h2>Categorías</h2>
          {loading ? (
            <p>Cargando categorías...</p>
          ) : categories.length > 0 ? (
            <ul className="categories-list">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.id}`}>
                    <div className="category-card">
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p>No hay categorías todavía.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
