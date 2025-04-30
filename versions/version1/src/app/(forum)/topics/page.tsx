import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import TopicList from '../../../components/forum/TopicList';

export default function Topics() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Temas de Discusión</h1>
      <p className="mb-4">Explora los diferentes temas de discusión del foro.</p>

      {/* Lista de temas (esta sería reemplazada por datos reales) */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((topic) => (
          <div key={topic} className="border p-4 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-bold mb-2">Tema de ejemplo {topic}</h2>
            <p className="text-gray-600 mb-4">Descripción del tema de ejemplo {topic} con algún contenido relevante...</p>
            <div className="flex justify-between items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Categoría</span>
              <div className="text-sm text-gray-500">
                <span className="mr-4">15 respuestas</span>
                <span>Actualizado hace 3 días</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
