"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('categories').select('*');
      if (!error) setCategories(data || []);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-8 rounded-2xl shadow-lg mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Bienvenido al Foro Hippo</h1>
        <p className="text-lg font-medium opacity-90">Un espacio para compartir conocimiento y conectar con mentes brillantes</p>
      </div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h2 className="text-2xl font-bold">Explora nuestras categorías</h2>
          <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow focus:outline-none focus:ring-2 focus:ring-indigo-400">Iniciar Sesión</Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Link href={`/category/${category.id}`} key={category.id} className="block">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 h-full border border-gray-100 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-2 text-indigo-700">{category.name}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{category.description}</p>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>12 temas</span>
                    <span>254 mensajes</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-indigo-600 font-medium text-sm">Ver debates →</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500 text-lg">No hay categorías disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
