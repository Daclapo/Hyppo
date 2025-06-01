"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import UserMenu from "@/components/UserMenu"

// Definiciones de tipos básicos para evitar any
interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Recientes")
  // El user se utiliza para obtener información del perfil y gestionar el estado de autenticación
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const supabase = createClient();
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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);

        // Obtener el perfil del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUsername("");
      }
    };

    checkSession();
    loadPosts(true);

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        setUser(session.user);

        // Obtener el perfil del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
        }

        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
        setUsername("");
        router.refresh();
      }    });    return () => {
      subscription.unsubscribe();
    };  }, [supabase, router, loadPosts]);

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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión:", error.message);
        return;
      }

      // Actualizar el estado manualmente para asegurar una respuesta inmediata en la UI
      setIsLoggedIn(false);
      setUser(null);
      setUsername("");

      // Forzar un refresco completo para limpiar cualquier estado persistente
      window.location.href = '/';
    } catch (err) {
      console.error("Error inesperado al cerrar sesión:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black">
        <div className="flex items-center">
          <Image src="/logo1-Oscuro.png" alt="Logo" width={48} height={48} className="rounded-lg mr-2" />
        </div>

        <div className="flex gap-3">
          {!isLoggedIn ? (
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
            </>          ) : (
            <UserMenu username={username} onLogout={handleLogout} />
          )}
        </div>
      </nav>

      <div className="flex">        {/* Sidebar */}
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
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => {
                      setActiveFilter(tab.name);
                      loadPosts(true); // Recargar con el nuevo filtro
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === tab.name
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>              {/* Posts List */}
              <div className="space-y-4 mb-8">
                {loading ? (
                  <div className="text-center py-8 text-gray-400">Cargando publicaciones...</div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No hay publicaciones disponibles. ¡Sé el primero en crear una!
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 shadow-sm"
                    >
                      {/* Upvotes */}
                      <div className="flex flex-col items-center text-gray-400 min-w-[60px]">
                        <span className="text-sm font-medium">{post.upvotes}</span>
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
                      </div>                      {/* Author and Meta */}
                      <div className="flex items-center gap-4 text-gray-400 text-sm min-w-[200px] justify-end">
                        <Link href={`/profile/${post.author}`} className="hover:text-white">
                          {post.author}
                        </Link>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Load More Button */}
              {posts.length > 0 && hasMore && (
                <div className="text-center">
                  <button
                    onClick={() => loadPosts(false)}
                    className="text-gray-400 hover:text-white text-sm px-4 py-2 bg-gray-800 rounded-lg"
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Cargar más"}
                  </button>
                </div>
              )}
            </div>

            {/* Mission Section */}
            <div className="mt-8 bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Misión del Proyecto</h2>
              <p className="text-gray-300 leading-relaxed">
                Nuestra plataforma está dedicada a fomentar discusiones profundas y significativas sobre temas
                importantes. Creemos en el poder del intercambio intelectual y la colaboración para abordar los desafíos
                más complejos de nuestro tiempo.
              </p>
            </div>

            {/* Library Preview */}
            <div className="mt-8 bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Biblioteca</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="text-white">Fundamentos de IA</span>
                  <span className="text-gray-400 text-sm">15 artículos</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="text-white">Ética y Tecnología</span>
                  <span className="text-gray-400 text-sm">23 artículos</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="text-white">Investigación Avanzada</span>
                  <span className="text-gray-400 text-sm">8 artículos</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
