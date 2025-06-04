"use client"

import { useState, useEffect, FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import UserMenuNew from "@/components/UserMenuNew"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import React from "react"

// Tipos para los datos
interface RouteParams {
  id: string;
}

interface Reflection {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  author_id: string;
  weekly_post_id: string;
  weekly_post_title: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: string;
  author_id: string;
}

export default function ReflectionPage({ params }: { params: Promise<RouteParams> }) {
  // Usar React.use para acceder a params en un componente cliente (Next.js 15)
  const resolvedParams = React.use(params);
  const reflectionId = resolvedParams.id;

  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();
  // Cargar la reflexión
  useEffect(() => {
    const fetchReflection = async () => {
      setLoading(true);
      try {
        // Obtener la reflexión con información del autor y publicación semanal relacionada
        const { data, error } = await supabase
          .from("weekly_reflections")
          .select(`
            id,
            title,
            content,
            created_at,
            user_id,
            weekly_post_id,
            profiles!weekly_reflections_user_id_fkey (
              id,
              username
            ),
            weekly_posts!weekly_reflections_weekly_post_id_fkey (
              title
            )
          `)
          .eq("id", reflectionId)
          .single();

        if (error) {
          console.error("Error al cargar la reflexión:", error);
          return;
        }

        if (data) {
          setReflection({
            id: data.id,
            title: data.title,
            content: data.content,
            created_at: formatDate(data.created_at),
            author: data.profiles?.username || "Usuario desconocido",
            author_id: data.user_id,
            weekly_post_id: data.weekly_post_id,
            weekly_post_title: data.weekly_posts?.title || "Publicación semanal"
          });
        }
      } catch (err) {
        console.error("Error inesperado al cargar la reflexión:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReflection();
  }, [reflectionId, supabase]);

  // Cargar comentarios
  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        // Obtener comentarios con información del autor
        const { data, error } = await supabase
          .from("weekly_reflection_comments")
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles!weekly_reflection_comments_user_id_fkey (
              id,
              username
            )
          `)
          .eq("reflection_id", reflectionId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error al cargar comentarios:", error);
          return;
        }

        const formattedComments = data.map(comment => ({
          id: comment.id,
          content: comment.content,
          created_at: formatDate(comment.created_at),
          author: comment.profiles?.username || "Usuario desconocido",
          author_id: comment.user_id
        }));

        setComments(formattedComments);
      } catch (err) {
        console.error("Error inesperado al cargar comentarios:", err);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (reflectionId) {
      fetchComments();
    }
  }, [reflectionId, supabase]);

  // Manejar envío de comentario
  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();

    if (!user || !reflection || !newComment.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      // Insertar nuevo comentario
      const { data, error } = await supabase
        .from("weekly_reflection_comments")
        .insert({
          reflection_id: reflection.id,
          user_id: user.id,
          content: newComment.trim()
        })
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles!weekly_reflection_comments_user_id_fkey (
            username
          )
        `)
        .single();

      if (error) {
        console.error("Error al publicar comentario:", error);
        return;
      }

      // Añadir nuevo comentario a la lista
      if (data) {
        const newCommentObj = {
          id: data.id,
          content: data.content,
          created_at: formatDate(data.created_at),
          author: data.profiles?.username || "Usuario desconocido",
          author_id: data.user_id
        };
        setComments(prev => [...prev, newCommentObj]);
        setNewComment(""); // Limpiar campo
      }
    } catch (err) {
      console.error("Error inesperado al publicar comentario:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Formatear fecha
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo1-Oscuro.png" alt="Logo" width={48} height={48} className="rounded-lg mr-2" />
          </Link>
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
            <Link href="/semanal" className="block text-green-500 hover:text-green-400 text-lg font-medium">
              Semanal
            </Link>
            <Link href="/biblioteca" className="block text-white hover:text-gray-300 text-lg">
              Biblioteca
            </Link>
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
            {loading ? (
              <div className="text-center py-12 text-gray-400">Cargando reflexión...</div>
            ) : !reflection ? (
              <div className="text-center py-12 text-gray-400">
                Reflexión no encontrada.
              </div>
            ) : (
              <>
                {/* Botón de volver */}
                <div className="mb-6">
                  <Link href={`/semanal/${reflection.weekly_post_id}`}>
                    <Button variant="outline" className="border-gray-600 hover:bg-gray-800 text-white">
                      ← Volver a "{reflection.weekly_post_title}"
                    </Button>
                  </Link>
                </div>

                {/* Reflexión */}
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-white mb-4">{reflection.title}</h1>

                  <div className="flex items-center text-gray-400 mb-6">
                    <span className="mr-4">Por {reflection.author}</span>
                    <span>{reflection.created_at}</span>
                  </div>

                  <div className="prose prose-invert max-w-none mb-8">
                    <MarkdownRenderer content={reflection.content} />
                  </div>
                </div>

                {/* Separador */}
                <div className="my-10 border-t border-gray-800"></div>

                {/* Sección de comentarios */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Comentarios</h2>

                  {commentsLoading ? (
                    <div className="text-center py-8 text-gray-400">Cargando comentarios...</div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      Aún no hay comentarios. ¡Sé el primero en comentar!
                    </div>
                  ) : (
                    <div className="space-y-6 mb-10">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-white">{comment.author}</span>
                            <span className="text-sm text-gray-400">{comment.created_at}</span>
                          </div>
                          <div className="prose prose-invert max-w-none">
                            <MarkdownRenderer content={comment.content} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulario para añadir comentario */}
                  {user ? (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-white mb-4">Añadir un comentario</h3>
                      <form onSubmit={handleSubmitComment}>
                        <div className="mb-4">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            rows={4}
                            placeholder="Escribe tu comentario..."
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={submitting || !newComment.trim()}
                        >
                          {submitting ? "Publicando..." : "Publicar comentario"}
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-300 mb-4">Inicia sesión para dejar un comentario.</p>
                      <Link href="/login">
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          Iniciar sesión
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
