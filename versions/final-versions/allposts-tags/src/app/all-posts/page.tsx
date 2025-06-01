"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

interface Post {
  id: string;
  title: string;
  upvote_count: number;
  created_at: string;
  author: {
    username: string;
  };
  timeAgo: string;
  isStarred: boolean;
}

interface GroupedPosts {
  [date: string]: Post[];
}

export default function AllPostsPage() {
  const [groupedPosts, setGroupedPosts] = useState<GroupedPosts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const supabase = createClient();

  // Función para formatear la fecha como "19 de abril de 2024"
  const formatDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  // Función para calcular el tiempo relativo
  const getTimeAgo = useCallback((date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (diffInSeconds < minute) {
      return "ahora";
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute);
      return `${minutes}m`;
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour);
      return `${hours}h`;
    } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day);
      return `${days}d`;
    } else if (diffInSeconds < month) {
      const weeks = Math.floor(diffInSeconds / week);
      return `${weeks}sem`;
    } else if (diffInSeconds < year) {
      const months = Math.floor(diffInSeconds / month);
      return `${months}m`;
    } else {
      const years = Math.floor(diffInSeconds / year);
      return `${years}a`;
    }
  }, []);

  // Función para agrupar publicaciones por fecha
  const groupPostsByDate = useCallback((posts: Post[]): GroupedPosts => {
    const grouped: GroupedPosts = {};

    posts.forEach(post => {
      const date = new Date(post.created_at);
      const dateStr = formatDate(date);

      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }

      grouped[dateStr].push(post);
    });

    return grouped;
  }, [formatDate]);

  useEffect(() => {
    async function fetchAllPosts() {
      setLoading(true);

      try {
        // Obtener todas las publicaciones ordenadas por fecha (más recientes primero)
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            created_at,
            upvote_count,
            user_id,
            profiles!posts_user_id_fkey (
              id,
              username
            )
          `)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // Transformar los datos para incluir autor y timeAgo
        const formattedPosts = data.map(post => ({
          id: post.id,
          title: post.title || "",
          upvote_count: post.upvote_count || 0,
          created_at: post.created_at || new Date().toISOString(),
          author: {
            username: post.profiles?.username || "Usuario desconocido"
          },
          timeAgo: getTimeAgo(new Date(post.created_at || new Date().toISOString())),
          isStarred: false // Por ahora, no implementamos la funcionalidad de destacados
        }));

        // Agrupar por fecha
        const grouped = groupPostsByDate(formattedPosts);
        setGroupedPosts(grouped);
      } catch (err) {
        console.error("Error al cargar las publicaciones:", err);
        setError("No se pudieron cargar las publicaciones");
      } finally {
        setLoading(false);
      }
    }    fetchAllPosts();
  }, [supabase, getTimeAgo, groupPostsByDate]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black">
        <Link href="/">
          <div className="flex items-center">
            <Image src="/logo1-Oscuro.png" alt="Logo" width={48} height={48} className="rounded-lg mr-2" />
          </div>
        </Link>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed top-20 left-0 w-64 p-6 h-screen bg-black pt-[88px]">
          {/* Navigation Links - Top Section */}
          <nav className="space-y-4 mb-16">
            <Link href="/" className="block text-white hover:text-gray-300 text-lg">
              Inicio
            </Link>
            <Link href="/all-posts" className="block text-green-500 hover:text-green-400 text-lg font-medium">
              Todo
            </Link>
            <Link href="/tags" className="block text-white hover:text-gray-300 text-lg">
              Etiquetas
            </Link>
            <a href="#" className="block text-white hover:text-gray-300 text-lg">
              Debates
            </a>
            <a href="#" className="block text-white hover:text-gray-300 text-lg">
              Semanal
            </a>
            <a href="#" className="block text-white hover:text-gray-300 text-lg">
              Biblioteca
            </a>
          </nav>

          {/* Bottom Navigation */}
          <nav className="space-y-4 absolute bottom-46">
            <Link href="/create-post" className="block text-white hover:text-gray-300 text-lg">
              Crear Publicación
            </Link>
            <a href="#" className="block text-white hover:text-gray-300 text-lg">
              Sugerencias
            </a>
            <a href="#" className="block text-white hover:text-gray-300 text-lg">
              About
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 mt-[88px] pl-64">
          <main className="p-6 max-w-4xl mx-auto">
            {/* Content Block */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6">Todas las publicaciones</h1>

              {loading ? (
                <div className="text-center py-8 text-gray-400">Cargando publicaciones...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-400">{error}</div>
              ) : Object.keys(groupedPosts).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No hay publicaciones disponibles.
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedPosts).map(([date, postsForDate]) => (
                    <div key={date} className="border-t border-gray-700 pt-4">
                      <h2 className="text-xl font-semibold mb-4 text-gray-300">{date}</h2>
                      <div className="space-y-4">
                        {postsForDate.map((post) => (
                          <div
                            key={post.id}
                            className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 shadow-sm"
                          >
                            {/* Upvotes */}
                            <div className="flex flex-col items-center text-gray-400 min-w-[60px]">
                              <span className="text-sm font-medium">{post.upvote_count}</span>
                            </div>

                            {/* Star */}
                            <div className="min-w-[20px]">
                              {post.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            </div>

                            {/* Title */}
                            <div className="flex-1">
                              <Link href={`/post/${post.id}`}>
                                <h3 className="text-white hover:text-gray-300 cursor-pointer text-lg">{post.title}</h3>
                              </Link>
                            </div>

                            {/* Author and Meta */}
                            <div className="flex items-center gap-4 text-gray-400 text-sm min-w-[200px] justify-end">
                              <Link href={`/profile/${post.author.username}`} className="hover:text-white">
                                {post.author.username}
                              </Link>
                              <span>{post.timeAgo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
