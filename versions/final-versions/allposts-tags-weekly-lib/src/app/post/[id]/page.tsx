"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { ArrowUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useAuth } from "@/context/AuthContext"

interface Post {
  id: string;
  title: string | null;
  content: string | null;
  upvote_count: number | null;
  created_at: string | null;
  updated_at?: string | null;
  user_id?: string;
  profiles?: {
    id: string;
    username: string;
  }
}

interface Tag {
  id: number;
  name: string;
  category: string | null;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
  }
}

export default function PostPage() {
	// Accedemos directamente a params.id (por ahora Next.js lo permite aunque muestre advertencia)
	// const postId = params.id;
	const params = useParams()
	const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState<string>("")
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false)
  const router = useRouter()
  const supabase = createClient()
  const { user, session } = useAuth()
  useEffect(() => {
    // Asegurémonos de que tenemos un ID antes de hacer la consulta
    if (!postId) {
      setError("ID de publicación no válido")
      setLoading(false)
      return
    }

    const fetchPostData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Obtener el post con información del autor
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select(`
            id,
            title,
            content,
            upvote_count,
            created_at,
            user_id,
            profiles:user_id (
              id,
              username
            )
          `)
          .eq("id", postId)
          .single()

        if (postError) {
          console.error("Error al cargar el post:", postError)
          setError("No se pudo cargar la publicación")
          setLoading(false)
          return
        }

        if (!postData) {
          setError("Publicación no encontrada")
          setLoading(false)
          return
        }

        console.log("Post cargado:", postData)
        setPost(postData)

        // Obtener las etiquetas asociadas al post
        const { data: tagData, error: tagError } = await supabase
          .from("post_tags")
          .select(`
            tags (
              id,
              name,
              category
            )
          `)
          .eq("post_id", postId)

        if (tagError) {
          console.error("Error al cargar etiquetas:", tagError)
        } else if (tagData) {
          // Transformar los datos para obtener solo los objetos de tags
          const extractedTags: Tag[] = tagData
            .filter(item => item.tags)
            .map(item => item.tags as Tag);

          setTags(extractedTags);
        }        // Verificar si el usuario ha votado por este post
        if (session) {
          const { data: voteData } = await supabase
            .from("post_upvotes")
            .select("*")
            .eq("post_id", postId)
            .eq("user_id", session.user.id)
            .maybeSingle()

          setHasVoted(!!voteData)
        }

        // Cargar los comentarios del post
        const { data: commentsData, error: commentsError } = await supabase
          .from("post_comments")
          .select(`
            id,
            post_id,
            user_id,
            content,
            created_at,
            profiles (
              id,
              username
            )
          `)
          .eq("post_id", postId)
          .order("created_at", { ascending: true })

        if (commentsError) {
          console.error("Error al cargar comentarios:", commentsError)
        } else if (commentsData) {
          setComments(commentsData)        }
      } catch (err) {
        console.error("Error al cargar el post:", err)
        setError("Ocurrió un error al cargar la publicación")
      } finally {
        setLoading(false)
      }
    }

    fetchPostData()
  }, [postId, supabase, session]);

  const handleVote = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!post) {
      return;    }

    try {
      if (!session) return;

      if (hasVoted) {
        // Ya votó, así que eliminamos el voto
        const { error: deleteError } = await supabase
          .from("post_upvotes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", session.user.id)

        if (deleteError) {
          console.error("Error al eliminar upvote:", deleteError)
          return
        }

        // Actualizar el recuento de votos en el post
        const newUpvoteCount = Math.max(0, (post.upvote_count || 0) - 1);
        const { data: updatedPost, error: updateError } = await supabase
          .from("posts")
          .update({ upvote_count: newUpvoteCount })
          .eq("id", post.id)
          .select(`
            id,
            title,
            content,
            upvote_count,
            created_at,
            user_id,
            profiles:user_id (
              id,
              username
            )
          `)
          .single()

        if (updateError) {
          console.error("Error al actualizar contador:", updateError)
          return
        }

        if (updatedPost) {
          setPost(updatedPost)
          setHasVoted(false)
        }
      } else {
        // No ha votado, así que añadimos el voto
        const { error: insertError } = await supabase
          .from("post_upvotes")
          .insert({
            post_id: post.id,
            user_id: session.user.id
          })

        if (insertError) {
          console.error("Error al insertar upvote:", insertError)
          return
        }

        // Actualizar el recuento de votos en el post
        const newUpvoteCount = (post.upvote_count || 0) + 1;
        const { data: updatedPost, error: updateError } = await supabase
          .from("posts")
          .update({ upvote_count: newUpvoteCount })
          .eq("id", post.id)
          .select(`
            id,
            title,
            content,
            upvote_count,
            created_at,
            user_id,
            profiles:user_id (
              id,
              username
            )
          `)
          .single()

        if (updateError) {
          console.error("Error al actualizar contador:", updateError)
          return
        }

        if (updatedPost) {
          setPost(updatedPost)
          setHasVoted(true)        }
      }
    } catch (err) {
      console.error("Error al gestionar el voto:", err)
    }
  }
  const handleSubmitComment = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!post || !newComment.trim()) {
      return;
    }

    try {
      setIsSubmittingComment(true)

      if (!session) {
        setIsSubmittingComment(false)
        return;
      }

      // Insertar el nuevo comentario
      const { data: commentData, error: commentError } = await supabase
        .from("post_comments")
        .insert({
          post_id: post.id,
          user_id: session.user.id,
          content: newComment.trim()
        })
        .select(`
          id,
          post_id,
          user_id,
          content,
          created_at,
          profiles (
            id,
            username
          )
        `)
        .single()

      if (commentError) {
        console.error("Error al publicar comentario:", commentError)
        alert("No se pudo publicar el comentario. Por favor, inténtalo de nuevo.")
        setIsSubmittingComment(false)
        return
      }

      // Actualizar la lista de comentarios
      setComments(prevComments => [...prevComments, commentData])
      setNewComment("")
    } catch (err) {
      console.error("Error al publicar comentario:", err)
      alert("Ocurrió un error al publicar el comentario.")
    } finally {
      setIsSubmittingComment(false)
    }
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
          <div className="text-center text-gray-400">Cargando publicación...</div>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error || !post) {
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
          <div className="text-red-400 mb-4">{error || "Publicación no encontrada"}</div>
          <Link href="/">
            <Button className="bg-gray-700 hover:bg-gray-600 text-white">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calcular la fecha formateada
  const formattedDate = post?.created_at
    ? new Date(post.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Fecha desconocida";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black">
        <Link href="/">
          <div className="flex items-center">
            <Image src="/logo1-Oscuro.png" alt="Logo" width={48} height={48} className="rounded-lg mr-2" />
          </div>
        </Link>
      </nav>

      <div className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Cabecera del post */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Link href={`/profile/${post.profiles?.username}`} className="text-white hover:text-gray-300">
                  {post.profiles?.username}
                </Link>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>

              {/* Botones de votos */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVote}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                    hasVoted
                      ? "bg-green-600/30 text-green-300"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>{post.upvote_count}</span>
                </button>
              </div>
            </div>

            {/* Etiquetas */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag: Tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.name}`}
                    className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm hover:bg-gray-700"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Contenido del post - Versión con Markdown (corregida) */}
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
            {post.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}                components={{
                  // Configuración personalizada para ciertos elementos HTML
                  a: ({...props}) => <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
                  h1: ({...props}) => <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />,
                  h2: ({...props}) => <h2 {...props} className="text-xl font-bold mt-5 mb-3" />,
                  h3: ({...props}) => <h3 {...props} className="text-lg font-bold mt-4 mb-2" />,
                  p: ({...props}) => <p {...props} className="mb-4" />,
                  ul: ({...props}) => <ul {...props} className="list-disc pl-5 mb-4" />,
                  ol: ({...props}) => <ol {...props} className="list-decimal pl-5 mb-4" />,
                  li: ({...props}) => <li {...props} className="mb-1" />,
                  blockquote: ({...props}) => <blockquote {...props} className="border-l-4 border-gray-600 pl-4 italic my-4" />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">No hay contenido disponible</p>
            )}
          </div>          {/* Sección de comentarios */}
          <div className="mt-12 border-t border-gray-800 pt-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comentarios ({comments.length})
            </h2>

            {/* Lista de comentarios */}
            {comments.length > 0 ? (
              <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800/30 rounded-lg p-4">                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/profile/${comment.profiles.username}`} className="font-medium text-white hover:text-gray-300">
                        {comment.profiles.username}
                      </Link>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-6 mb-8">
                No hay comentarios todavía. ¡Sé el primero en comentar!
              </div>
            )}            {/* Formulario para añadir comentario */}
            {user ? (
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3 text-gray-300">Añadir un comentario</h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario aquí..."
                  className="w-full bg-gray-800 text-white rounded-md p-3 min-h-24 mb-3 resize-y"
                  style={{
                    minHeight: `${Math.max(96, Math.min(300, 24 + newComment.length / 5))}px`
                  }}
                  maxLength={5000}
                ></textarea>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {newComment.length}/5000 caracteres
                  </span>
                  <Button
                    onClick={handleSubmitComment}
                    disabled={isSubmittingComment || newComment.trim().length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmittingComment ? "Publicando..." : "Publicar comentario"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                <p className="text-gray-300 mb-3">Inicia sesión para dejar un comentario</p>
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Iniciar sesión
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
