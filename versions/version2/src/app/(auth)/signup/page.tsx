"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../../hooks/useAuth';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase/client';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const validate = () => {
    if (!email || !password || !name) {
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
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPendingVerification(false);
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, error } = await signUp(email, password, name);
      if (error) {
        setError(error.message || 'Error al registrarse');
        return;
      }
      if (user) {
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        if (freshUser && freshUser.email_confirmed_at) {
          setSuccess('¡Registro exitoso! Redirigiendo...');
          setTimeout(() => router.push('/'), 2000);
        } else {
          setPendingVerification(true);
          setSuccess('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
        }
      }
    } catch (err) {
      setError('Error al registrarse. Por favor, inténtalo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">Crea tu cuenta</h1>
      <p className="text-center text-gray-500 mb-6">Únete a la comunidad y participa en los debates</p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-shake">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 animate-fade-in">
          {success}
        </div>
      )}
      {pendingVerification && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 animate-fade-in">
          Debes verificar tu email antes de poder acceder. Si no recibiste el correo, revisa tu carpeta de spam o solicita un nuevo enlace desde la página de login.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400"><HiOutlineUser size={20} /></span>
          <input
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="name"
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400"><HiOutlineMail size={20} /></span>
          <input
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400"><HiOutlineLockClosed size={20} /></span>
          <input
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-3 text-gray-500 hover:text-blue-600 focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.221 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.956 9.956 0 0021.9 12c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.364-.964M3 3l18 18" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0121.9 12c0 5.523-4.477 10-10 10S1.9 17.523 1.9 12c0-1.657.403-3.221 1.125-4.575" /></svg>
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
          Registrarse
        </Button>
        <div className="flex justify-between items-center mt-2">
          <Link href="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
