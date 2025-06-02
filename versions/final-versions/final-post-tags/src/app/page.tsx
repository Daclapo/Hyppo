"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import UserMenuNew from "@/components/UserMenuNew"
import { useAuth } from "@/context/AuthContext"

// Definiciones de tipos básicos
interface Post {
  id: string;
  title: string;
  upvotes: number;
  author: string;
  timeAgo: string;
  isStarred: boolean;
}

const filterTabs = [
  { name: "Recientes", active: true },
  { name: "Recomendadas", active: false },
]

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("Recientes")
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);  const [hasMore, setHasMore] = useState(true);
  const supabase = createClient();

  // Usando el contexto de autenticación
  const { user } = useAuth();

  // Usando useCallback para prevenir la recreación de la función
  const loadPosts = useCallback(async (resetPage = false) => {
    setLoading(true);
    try {
      // Si es una nueva carga, resetear la página
      const currentPage = resetPage ? 0 : page;
      const limit = currentPage === 0 ? 10 : 20; // 10 iniciales, luego 20 por carga
      const from = currentPage === 0 ? 0 : 10 + (currentPage - 1) * 20;

      // Determinar el ordenamiento según el filtro activo
      const orderBy = activeFilter === "Recientes"
        ? { column: "created_at", ascending: false }
        : { column: "upvote_count", ascending: false };

      // Obtener los posts con información del autor
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          upvote_count,
          created_at,
          user_id,
          profiles!posts_user_id_fkey (
            id,
            username
          )
        `)
        .order(orderBy.column, { ascending: orderBy.ascending })
        .range(from, from + limit - 1);

      if (error) {
        console.error("Error al cargar posts:", error);
        return;
      }

      // Procesar los posts para el formato que necesitamos
      const formattedPosts = data.map((post) => {
        // Calcular tiempo relativo y manejar valores nulos
        const timeAgo = getTimeAgo(new Date(post.created_at || new Date().toISOString()));

        return {
          id: post.id,
          title: post.title || "",
          upvotes: post.upvote_count || 0,
          author: post.profiles?.username || "Usuario desconocido",
          timeAgo,
          isStarred: false // Implementaremos destacados más adelante
        };
      });

      // Si es una nueva carga, reemplazar posts, si no, añadir
      if (resetPage) {
        setPosts(formattedPosts);
        setPage(0);
      } else {
        setPosts(prev => [...prev, ...formattedPosts]);
        setPage(currentPage + 1);
      }

      // Determinar si hay más posts para cargar
      setHasMore(data.length === limit);
    } catch (err) {
      console.error("Error al cargar posts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter, supabase]);

  useEffect(() => {
    // Cargar publicaciones inmediatamente
    loadPosts(true);
  }, [loadPosts]);

  // Función para calcular el tiempo relativo
  function getTimeAgo(date: Date): string {
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
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black">
        <div className="flex items-center">
          <Image src="/logo1-Oscuro.png" alt="Logo" width={48} height={48} className="rounded-lg mr-2" />
        </div>

        <div className="flex gap-3">
          {!user ? (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 rounded-full px-6"
                >
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gray-700 text-white hover:bg-gray-600 rounded-full px-6">
                  Registrarse
                </Button>
              </Link>
            </>
          ) : (
            <UserMenuNew />
          )}
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed top-20 left-0 w-64 p-6 h-screen bg-black pt-[88px]">
          {/* Navigation Links - Top Section */}
          <nav className="space-y-4 mb-16">
            <Link href="/" className="block text-green-500 hover:text-green-400 text-lg font-medium">
              Inicio
            </Link>
            <Link href="/all-posts" className="block text-white hover:text-gray-300 text-lg">
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
          <nav className="space-y-4 absolute bottom-6">
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
            {/* Filtros */}
            <div className="flex mb-8 border-b border-gray-800 overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`px-4 py-2 mr-4 border-b-2 ${
                    activeFilter === tab.name
                      ? "border-green-500 text-green-500"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveFilter(tab.name);
                    // Recargar los posts con el nuevo filtro
                    loadPosts(true);
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Lista de posts */}
            {loading && posts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">Cargando publicaciones...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No hay publicaciones disponibles.
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-gray-800 rounded-lg transition-colors hover:bg-gray-700 border border-gray-700"
                  >
                    <Link href={`/post/${post.id}`}>
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-medium text-white mb-2">{post.title}</h2>
                        <button
                          className={`p-1 rounded-full ${
                            post.isStarred ? "text-yellow-400" : "text-gray-500 hover:text-gray-400"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Lógica para destacar post (implementar más adelante)
                          }}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <div className="flex items-center gap-3">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.upvotes} votos</span>
                        </div>
                        <span>{post.timeAgo}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Botón para cargar más */}
            {hasMore && (
              <div className="text-center py-4">
                <Button
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                  onClick={() => loadPosts()}
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Cargar más"}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
