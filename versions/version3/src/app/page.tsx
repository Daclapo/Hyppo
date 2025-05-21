"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import Link from 'next/link';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Nuevo estado para mensajes de error

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        // Limitar el número de categorías a mostrar, por ejemplo, a 6.
        // Para mostrar todas, elimina .limit(6)
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .limit(6); // <--- Añadido para limitar resultados y mejorar visualización inicial

        if (fetchError) {
          throw fetchError;
        }
        setCategories(data || []);
      } catch (err: any) {
        console.error('Error fetching categories:', err.message);
        setError(`Error al cargar categorías. ${err.message}`);
        setCategories([]); // Asegurar que las categorías estén vacías en caso de error
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  let content;

  if (loading) {
    content = (
      <div className="flex justify-center items-center min-h-[25rem] py-12"> {/* Aumentada altura mínima y padding */}
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div> {/* Spinner más grande y color ajustado */}
      </div>
    );
  } else if (error) {
    content = (
      <div className="bg-red-50 border border-red-300 p-10 text-center rounded-xl shadow-lg min-h-[25rem] flex flex-col justify-center items-center animate-fade-in"> {/* Padding aumentado y borde ajustado */}
        <svg className="w-20 h-20 text-red-500 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {/* Icono y color ajustados */}
        <h3 className="text-2xl font-semibold text-red-700 mb-3">¡Oops! Algo salió mal</h3> {/* Tamaño de fuente y margen ajustados */}
        <p className="text-red-600 text-lg mb-6">{error}</p> {/* Tamaño de fuente y margen ajustados */}
        <button
          onClick={() => { /* Lógica para reintentar, si se desea */
            setLoading(true);
            setError(null);
            // Re-llamar a fetchCategories() o una función similar
            // Para este ejemplo, simplemente recargamos la página para simular un reintento
            // En una app real, sería mejor volver a llamar a la función fetch.
            const fetchAgain = async () => {
                const { data, error: fetchError } = await supabase.from('categories').select('*');
                if (fetchError) {
                    console.error('Error fetching categories:', fetchError.message);
                    setError(`Error al cargar categorías. ${fetchError.message}`);
                    setCategories([]);
                } else {
                    setCategories(data || []);
                }
                setLoading(false);
            };
            fetchAgain();
          }}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300 shadow hover:shadow-md"
        >
          Reintentar
        </button>
      </div>
    );
  } else if (categories.length > 0) {
    content = (
      // Ajustado para md:grid-cols-3 para mostrar hasta 3 categorías por fila en pantallas medianas y grandes
      // Se añade más gap para mejor separación visual
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[25rem] animate-fade-in"> {/* Columnas y gap ajustados */}
        {categories.map((category) => (
          <Link href={`/category/${category.id}`} key={category.id} className="block group">
            {/* Tarjeta de categoría con más padding, sombra más pronunciada y mejor feedback en hover */}
            <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-7 h-full border border-gray-200 flex flex-col justify-between transform group-hover:scale-105 group-hover:border-indigo-600">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-indigo-700 group-hover:text-indigo-500 transition-colors">{category.name}</h3> {/* Tamaño de fuente ajustado */}
                <p className="text-gray-700 text-base mb-5 flex-1 leading-relaxed">{category.description || 'Explora esta categoría para descubrir discusiones interesantes.'}</p> {/* Color y line-height ajustados, placeholder mejorado */}
              </div>
              <div className="mt-auto pt-5 border-t border-gray-200"> {/* Padding top aumentado */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3"> {/* Tamaño de fuente y margen ajustados */}
                  <span><strong className="font-semibold text-gray-700">{category.topic_count || 0}</strong> temas</span> {/* Color de texto mejorado */}
                  <span><strong className="font-semibold text-gray-700">{category.post_count || 0}</strong> mensajes</span> {/* Color de texto mejorado */}
                </div>
                <span className="text-indigo-600 font-semibold text-base group-hover:underline inline-flex items-center"> {/* Tamaño de fuente ajustado */}
                  Ver debates
                  <svg className="w-5 h-5 ml-1.5 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg> {/* Tamaño e icono ajustados */}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } else {
    content = (
      <div className="bg-gray-100 border border-gray-300 p-10 text-center rounded-xl shadow-lg min-h-[25rem] flex flex-col justify-center items-center animate-fade-in"> {/* Color de fondo, borde y padding ajustados */}
        <svg className="w-24 h-24 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg> {/* Icono y margen ajustados */}
        <h3 className="text-2xl font-semibold text-gray-700 mb-3">No hay categorías por aquí</h3> {/* Tamaño de fuente y margen ajustados */}
        <p className="text-gray-600 text-lg">Parece que aún no se han creado categorías. ¡Vuelve pronto!</p> {/* Color y tamaño de fuente ajustados */}
        {/* Podrías añadir un botón para que administradores creen una categoría */}
      </div>
    );
  }

  return (
    // Se mantiene container mx-auto y se ajusta el padding horizontal para diferentes breakpoints
    // px-4 es el base, sm:px-6 para pantallas pequeñas, lg:px-12 para más grandes, xl:px-24 para extra grandes
    // max-w-7xl para un ancho máximo un poco mayor que antes.
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-10 md:py-16 max-w-7xl animate-fade-in">
      {/* Banner principal con padding y margen inferior ajustados */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 sm:p-10 md:p-12 rounded-3xl shadow-2xl mb-12 md:mb-16 transform hover:scale-[1.02] transition-transform duration-300 ease-out">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">Bienvenido al Foro Hippo</h1> {/* Tamaño de fuente ajustado para lg */}
        <p className="text-xl sm:text-2xl font-medium opacity-90 max-w-3xl">Un espacio para compartir conocimiento y conectar con mentes brillantes.</p> {/* Tamaño de fuente y max-width ajustados */}
      </div>

      <div className="mb-12 md:mb-16"> {/* Margen inferior aumentado */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 md:mb-10 gap-5"> {/* Margen inferior y gap ajustados */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Explora Nuestras Categorías</h2> {/* Tamaño de fuente ajustado */}
          <Link
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
          >
            Iniciar Sesión
          </Link>
        </div>
        {content}
      </div>

      <div className="mt-16 md:mt-20 p-10 bg-white border border-gray-200 rounded-2xl shadow-xl text-center"> {/* Padding y margen superior ajustados */}
        <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-5">¿Listo para Unirte a la Conversación?</h3> {/* Tamaño de fuente y margen ajustados */}
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">Regístrate hoy para crear temas, publicar respuestas y ser parte de nuestra creciente comunidad. Es rápido, fácil y gratis.</p> {/* Color, tamaño de fuente, margen y line-height ajustados */}
        <Link
          href="/signup"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
        >
          Crear una Cuenta
        </Link>
      </div>
    </div>
  );
}
