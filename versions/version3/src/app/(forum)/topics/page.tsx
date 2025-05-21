'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import TopicList from '../../../components/forum/TopicList';
import { Topic } from '../../../types';

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        // Obtener temas con conteo de posts
        const { data, error } = await supabase
          .from('topics')
          .select('*, posts(count)');

        if (error) {
          console.error('Error cargando temas:', error);
          throw error;
        }

        const topicsWithCounts = data?.map(topic => ({
          ...topic,
          posts_count: topic.posts?.[0]?.count || 0
        })) || [];

        setTopics(topicsWithCounts);
      } catch (error) {
        console.error('Error:', error);
        // Datos de ejemplo en caso de error
        setTopics([
          { id: '1', name: 'Inteligencia Artificial', description: 'Discusión sobre IA y sus aplicaciones', created_at: new Date().toISOString(), posts_count: 15 },
          { id: '2', name: 'Desarrollo Web', description: 'Tecnologías y frameworks para desarrollo web', created_at: new Date().toISOString(), posts_count: 23 },
          { id: '3', name: 'Ciencia de Datos', description: 'Análisis de datos, estadística y machine learning', created_at: new Date().toISOString(), posts_count: 8 },
          { id: '4', name: 'Desarrollo Mobile', description: 'Apps para iOS, Android y multiplataforma', created_at: new Date().toISOString(), posts_count: 12 },
          { id: '5', name: 'Seguridad Informática', description: 'Ciberseguridad, hacking ético y protección de datos', created_at: new Date().toISOString(), posts_count: 7 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">Temas de Discusión</h1>
      <p className="mb-4 text-gray-700">Explora los diferentes temas de discusión del foro.</p>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <TopicList topics={topics} />
      )}
    </div>
  );
}
