"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import EditProfileModal from "@/components/EditProfileModal"

interface Post {
  id: string;
  title: string;
  upvote_count: number;
  created_at: string;
  timeAgo: string;
}

interface Profile {
  id: string;
  username: string;
  bio: string | null;
  created_at: string | null;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Verificar sesión del usuario
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);

        // Obtener perfil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) {
          setError("No se pudo encontrar el perfil del usuario");
          setLoading(false);
          return;
        }

        setProfile(profileData);

        // Verificar si es el perfil propio
        if (session && profileData.id === session.user.id) {
          setIsOwnProfile(true);
        }

        // Obtener publicaciones del usuario
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error("Error al cargar publicaciones:", postsError);
        } else {
          const formattedPosts = postsData.map(post => ({
            ...post,
            title: post.title || "",  // Garantizar que title nunca sea null
            upvote_count: post.upvote_count || 0,
            timeAgo: getTimeAgo(new Date(post.created_at || new Date().toISOString()))
          }));
          setPosts(formattedPosts);
        }
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setError("Ocurrió un error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchData();
    }
  }, [username, supabase]);

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

  // Manejador para actualizar el perfil
  const handleProfileUpdate = (newBio: string | null) => {
    if (profile) {
      setProfile({
        ...profile,
        bio: newBio
      });
      setShowEditModal(false);
    }
  };

  // Formatea la fecha para mostrarla
  function formatDate(dateString: string | null): string {
    if (!dateString) return "Fecha desconocida";

    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black">
          <Link href="/">
            <div className="flex items-center">
              <Image src="/logo1-Oscuro.png" alt="Logo" width={48} height={48} className="rounded-lg mr-2" />
            </div>
          </Link>
        </nav>

        <div className="flex-1 pt-24 flex justify-center items-center">
          <div className="text-center text-gray-400">Cargando perfil...</div>
        </div>
      </div>
    );
  }
  // Mostrar error
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black">
          <Link href="/">
            <div className="flex items-center">
              <Image src="/logo1-Oscuro.png" alt="Logo" width={48} height={48} className="rounded-lg mr-2" />
            </div>
          </Link>
        </nav>

        <div className="flex-1 pt-24 flex flex-col justify-center items-center">
          <div className="text-red-400 mb-4">{error || "Perfil no encontrado"}</div>
          <Link href="/">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
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
            {/* Información del perfil */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-2 md:mb-0">{profile.username}</h1>
                {isOwnProfile && (
                  <Button
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                    onClick={() => setShowEditModal(true)}
                  >
                    Editar perfil
                  </Button>
                )}
              </div>

              {profile.bio && (
                <div className="mb-4">
                  <h2 className="text-sm text-gray-400 mb-1">Biografía</h2>
                  <p className="text-white">{profile.bio}</p>
                </div>
              )}

              <div>
                <h2 className="text-sm text-gray-400 mb-1">Miembro desde</h2>
                <p className="text-white">{formatDate(profile.created_at)}</p>
              </div>
            </div>

            {/* Publicaciones del usuario */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Publicaciones</h2>

              {posts.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Este usuario aún no ha realizado ninguna publicación.
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-gray-800 rounded-lg transition-colors hover:bg-gray-700 border border-gray-700"
                    >
                      <Link href={`/post/${post.id}`}>
                        <h3 className="text-lg font-medium text-white mb-2">{post.title}</h3>

                        <div className="flex justify-between items-center text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <span>{post.upvote_count} votos</span>
                          </div>
                          <span>{post.timeAgo}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {showEditModal && profile && (
        <EditProfileModal
          profileId={profile.id}
          initialBio={profile.bio}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
}
