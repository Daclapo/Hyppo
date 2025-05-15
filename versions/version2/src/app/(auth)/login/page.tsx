"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../../hooks/useAuth';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  // Nuevo: login social
  const [socialLoading, setSocialLoading] = useState(false);
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) setError('Error con el login social.');
      // El usuario será redirigido automáticamente por Supabase
    } catch (err) {
      setError('Error con el login social.');
    } finally {
      setSocialLoading(false);
    }
  };
  // Nuevo: recuperación de contraseña
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg('');
    if (!resetEmail) return setResetMsg('Introduce tu email.');
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) setResetMsg('Error al enviar el email.');
    else setResetMsg('Revisa tu correo para restablecer la contraseña.');
  };

  const validate = () => {
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Introduce un email válido.');
      return false;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Credenciales inválidas. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtalo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transform transition-all">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-2">Iniciar Sesión</h1>
        <p className="text-center text-gray-500 mb-6">Accede para participar y personalizar tu experiencia</p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}
        {showReset ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="mb-4">
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
                placeholder="Tu correo electrónico"
              />
            </div>
            <Button type="submit" fullWidth loading={socialLoading}>Enviar enlace</Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => setShowReset(false)}>Volver</Button>
            {resetMsg && <div className="text-sm text-indigo-600 mt-2 text-center">{resetMsg}</div>}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="mb-4">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Correo electrónico"
              />
            </div>
            <div className="relative">
              <input
                className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Contraseña"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-indigo-600 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.221 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.956 9.956 0 0021.9 12c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.364-.964M3 3l18 18" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0121.9 12c0 5.523-4.477 10-10 10S1.9 17.523 1.9 12c0-1.657.403-3.221 1.125-4.575" /></svg>
                )}
              </button>
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Iniciar Sesión
            </Button>
            <div className="flex flex-col gap-2 mt-2">
              <Button type="button" variant="secondary" fullWidth loading={socialLoading} onClick={() => handleSocialLogin('google')}>Iniciar sesión con Google</Button>
              <Button type="button" variant="dark" fullWidth loading={socialLoading} onClick={() => handleSocialLogin('github')}>Iniciar sesión con GitHub</Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                ¿No tienes cuenta? Regístrate
              </Link>
              <button type="button" className="text-sm text-gray-500 hover:text-indigo-600 underline" onClick={() => setShowReset(true)}>¿Olvidaste tu contraseña?</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
