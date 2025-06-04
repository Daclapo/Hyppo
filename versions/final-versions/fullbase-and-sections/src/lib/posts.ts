import { createClient } from "@/lib/supabase/server"

// Definir interfaz para los resultados de la consulta
interface PostWithAuthor {
  id: string;
  title: string;
  content: string;
  upvote_count: number;
  created_at: string;
  profiles: {
    id: string;
    username: string;
  };
}

export async function getPostsWithAuthors() {
  const supabase = await createClient()

  // Obtener los posts con información del autor y recuento de comentarios
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      upvote_count,
      created_at,
      profiles (
        id,
        username
      )
    `)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  // Convertir los resultados a un formato más conveniente usando la interfaz
  return (posts as unknown as PostWithAuthor[]).map(post => {
    // Calcular tiempo relativo
    const timeAgo = getTimeAgo(new Date(post.created_at))

    return {
      id: post.id,
      title: post.title,
      upvotes: post.upvote_count,
      author: post.profiles?.username || "Usuario desconocido",
      timeAgo,
      // Implementaremos comentarios más adelante
      comments: 0
    }
  })
}

// Función para calcular el tiempo relativo
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365

  if (diffInSeconds < minute) {
    return "ahora"
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute)
    return `${minutes}m`
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour)
    return `${hours}h`
  } else if (diffInSeconds < week) {
    const days = Math.floor(diffInSeconds / day)
    return `${days}d`
  } else if (diffInSeconds < month) {
    const weeks = Math.floor(diffInSeconds / week)
    return `${weeks}sem`
  } else if (diffInSeconds < year) {
    const months = Math.floor(diffInSeconds / month)
    return `${months}m`
  } else {
    const years = Math.floor(diffInSeconds / year)
    return `${years}a`
  }
}

// Función para verificar si un post está destacado (implementaremos esto más adelante)
export async function checkStarredPosts(postIds: string[]) {
  // Por ahora, devolvemos un objeto vacío
  return {} as Record<string, boolean>
}
