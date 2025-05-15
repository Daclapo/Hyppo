"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase/client';
import PostForm from '../../../../components/forum/PostForm';
import PostCard from '../../../../components/forum/PostCard';
import Link from 'next/link';
import Button from '../../../../components/ui/Button';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    name: string;
    avatar_url?: string;
  };
}

interface Topic {
  id: string;
  title: string;
  description: string;
  created_at: string;
  room_id: string;
  user_id: string;
  profiles?: {
    username: string;
    name: string;
    avatar_url?: string;
  };
  rooms?: {
    name: string;
    icon?: string;
  };
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopicAndPosts = async () => {
      if (!topicId) return;

      try {
        // Obtener detalles del tema
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select(`
            *,
            profiles (*),
            rooms (*)
          `)
          .eq('id', topicId)
          .single();

        if (topicError) {
          throw new Error(`Error al cargar el tema: ${topicError.message}`);
        }

        setTopic(topicData as unknown as Topic);

        // Obtener posts del tema
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles (*)
          `)
          .eq('topic_id', topicId)
          .order('created_at', { ascending: true });

        if (postsError) {
          throw new Error(`Error al cargar los posts: ${postsError.message}`);
        }

        setPosts(postsData as unknown as Post[]);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndPosts();
  }, [topicId]);

  const handleNewPost = (newPost: Post) => {
    setPosts(prevPosts => [...prevPosts, newPost]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="mt-8 h-24 w-full max-w-2xl bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 max-w-lg w-full">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">
            {error || "No se pudo cargar el tema. Puede que ya no exista o no tienes permisos para verlo."}
          </p>
          <Button 
            variant="secondary"
            onClick={() => router.back()}
          >
            Volver atrás
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb y navegación */}
      <div className="mb-8 flex flex-wrap items-center text-sm">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800">
          Inicio
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link href="/rooms" className="text-indigo-600 hover:text-indigo-800">
          Salas
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        {topic.rooms && (
          <>
            <Link href={`/rooms/${topic.room_id}`} className="text-indigo-600 hover:text-indigo-800">
              {topic.rooms.name}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
          </>
        )}
        <span className="font-medium text-gray-700">{topic.title}</span>
      </div>

      {/* Cabecera del tema */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{topic.title}</h1>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              {topic.profiles?.avatar_url ? (
                <img 
                  src={topic.profiles.avatar_url} 
                  alt={topic.profiles.username || "Usuario"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-indigo-600 font-medium">
                  {topic.profiles?.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {topic.profiles?.name || 'Usuario anónimo'}
              </p>
              <p className="text-xs text-gray-500">
                Creado el {new Date(topic.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              {posts.length} {posts.length === 1 ? 'respuesta' : 'respuestas'}
            </span>
          </div>
        </div>
        
        {topic.description && (
          <div className="text-gray-700 mb-2 bg-gray-50 p-4 rounded-lg">
            {topic.description}
          </div>
        )}
      </div>

      {/* Lista de posts */}
      <div className="space-y-4 mb-8">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No hay respuestas todavía. ¡Sé el primero en responder!</p>
          </div>
        )}
      </div>

      {/* Formulario para nuevos posts */}
      <div className="bg-white rounded-2xl shadow-md">
        <PostForm topicId={topicId} onSuccess={handleNewPost} />
      </div>
    </div>
  );
}
