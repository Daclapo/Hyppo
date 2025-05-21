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

  // Login social
  const [socialLoading, setSocialLoading] = useState(false);
  const handleSocialLogin = async (provider) => {
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

  // Recuperación de contraseña
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const handleReset = async (e) => {
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

  const handleSubmit = async (e) => {
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Iniciar Sesión</h1>
        <p className="text-center text-gray-500 mb-8">Accede para participar y personalizar tu experiencia</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {showReset ? (
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
                placeholder="Tu correo electrónico"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth variant="primary" loading={socialLoading}>
                Enviar enlace de recuperación
              </Button>
            </div>

            <div>
              <Button type="button" variant="secondary" fullWidth onClick={() => setShowReset(false)}>
                Volver al login
              </Button>
            </div>

            {resetMsg && (
              <div className="mt-4 text-sm text-center text-indigo-600">{resetMsg}</div>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Correo electrónico"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.221 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Iniciar Sesión
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O inicia sesión con</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                loading={socialLoading}
                onClick={() => handleSocialLogin('google')}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google
                </span>
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Link href="/signup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                ¿No tienes cuenta? Regístrate
              </Link>
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => setShowReset(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
