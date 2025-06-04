"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { Tag } from "lucide-react"

interface TagData {
  id: number;
  name: string;
  category: string | null;
  post_count: number;
}

interface GroupedTags {
  [category: string]: TagData[];
}

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

export default function TagsPage() {
  const [groupedTags, setGroupedTags] = useState<GroupedTags>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);

      try {
        // Obtener etiquetas con conteo de publicaciones
        const { data, error: fetchError } = await supabase
          .from('tags')
          .select('id, name, category');

        if (fetchError) {
          throw fetchError;
        }

        // Para cada etiqueta, obtenemos el conteo de publicaciones
        const tagsWithCounts = await Promise.all(
          data.map(async (tag) => {
            const { count, error: countError } = await supabase
              .from('post_tags')
              .select('*', { count: 'exact', head: true })
              .eq('tag_id', tag.id);

            if (countError) {
              console.error(`Error al obtener conteo para tag ${tag.name}:`, countError);
              return { ...tag, post_count: 0 };
            }

            return { ...tag, post_count: count || 0 };
          })
        );        // Ordenar por número de publicaciones (descendente)
        const sortedTags = tagsWithCounts.sort((a, b) => b.post_count - a.post_count);

        // Agrupar por categoría
        const grouped = groupTagsByCategory(sortedTags);
        setGroupedTags(grouped);
      } catch (err) {
        console.error("Error al cargar las etiquetas:", err);
        setError("No se pudieron cargar las etiquetas");
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, [supabase]);

  // Función para agrupar etiquetas por categoría
  function groupTagsByCategory(tags: TagData[]): GroupedTags {
    const grouped: GroupedTags = {};

    // Primero, agrupamos los que tienen categoría
    tags.forEach(tag => {
      const category = tag.category || "Sin categoría";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(tag);
    });

    return grouped;
  }

  // Función para obtener publicaciones por etiqueta
  async function fetchPostsByTag(tagName: string) {
    setLoadingPosts(true);
    setSelectedTag(tagName);

    try {
      // Primero obtenemos el ID de la etiqueta
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single();

      if (tagError) {
        throw tagError;
      }

      // Obtenemos las publicaciones asociadas a esta etiqueta
      const { data: postTags, error: postTagsError } = await supabase
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', tagData.id);

      if (postTagsError) {
        throw postTagsError;
      }

      if (postTags.length === 0) {
        setPosts([]);
        setLoadingPosts(false);
        return;
      }      // Obtenemos los detalles de cada publicación
      const postIds = postTags.map(pt => pt.post_id);
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          created_at,
          upvote_count,
          user_id,
          profiles!posts_user_id_fkey (
            id,
            username
          )
        `)
        .in('id', postIds)
        .order('created_at', { ascending: false });

      if (postsError) {
        throw postsError;
      }

      // Transformamos los datos
      const formattedPosts = postsData.map(post => ({
        id: post.id,
        title: post.title || "",
        upvote_count: post.upvote_count || 0,
        created_at: post.created_at || new Date().toISOString(),
        author: {
          username: post.profiles?.username || "Usuario desconocido"
        },
        timeAgo: getTimeAgo(new Date(post.created_at || new Date().toISOString())),
        isStarred: false
      }));

      setPosts(formattedPosts);
    } catch (err) {
      console.error(`Error al cargar publicaciones para la etiqueta ${tagName}:`, err);
      setError(`No se pudieron cargar las publicaciones para la etiqueta ${tagName}`);
    } finally {
      setLoadingPosts(false);
    }
  }

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
            <Link href="/tags" className="block text-green-500 hover:text-green-400 text-lg font-medium">
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
              <h1 className="text-2xl font-bold mb-6">Explorar por etiquetas</h1>

              {loading ? (
                <div className="text-center py-8 text-gray-400">Cargando etiquetas...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-400">{error}</div>
              ) : (
                <div className="flex">
                  {/* Lista de etiquetas */}
                  <div className="w-1/3 pr-6 border-r border-gray-700">
                    <div className="space-y-4">
                      {Object.entries(groupedTags).map(([category, tagsInCategory]) => (
                        <div key={category} className="mb-6">
                          <h2 className="text-lg font-semibold mb-3 text-gray-300">{category}</h2>
                          <div className="space-y-2">
                            {tagsInCategory.map((tag) => (
                              <button
                                key={tag.id}
                                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                  selectedTag === tag.name
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                                onClick={() => fetchPostsByTag(tag.name)}
                              >
                                <div className="flex items-center">
                                  <Tag className="w-4 h-4 mr-2" />
                                  <span>{tag.name}</span>
                                </div>
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                                  {tag.post_count}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lista de publicaciones para la etiqueta seleccionada */}
                  <div className="w-2/3 pl-6">
                    {selectedTag ? (
                      <>
                        <h2 className="text-xl font-semibold mb-4">
                          Publicaciones con la etiqueta <span className="text-green-500">#{selectedTag}</span>
                        </h2>

                        {loadingPosts ? (
                          <div className="text-center py-8 text-gray-400">Cargando publicaciones...</div>
                        ) : posts.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            No hay publicaciones con esta etiqueta.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {posts.map((post) => (
                              <div
                                key={post.id}
                                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 shadow-sm"
                              >
                                {/* Upvotes */}
                                <div className="flex flex-col items-center text-gray-400 min-w-[60px]">
                                  <span className="text-sm font-medium">{post.upvote_count}</span>
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
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Tag className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg">Selecciona una etiqueta para ver las publicaciones asociadas</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
