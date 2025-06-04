"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
}

const filterTabs = [
  { name: "Recientes", active: true },
  { name: "Recomendadas", active: false },
]

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("Recientes")
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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

      console.log(`Cargando posts: Filtro=${activeFilter}, Página=${currentPage}, Desde=${from}, Límite=${limit}`);

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
          timeAgo
        };
      });

      console.log(`Posts cargados: ${formattedPosts.length}`);

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

  // Cargar posts cuando cambia el filtro o al inicio
  useEffect(() => {
    // Resetear estado cuando cambia el filtro
    setPage(0);
    setPosts([]);
    setLoading(true);
    loadPosts(true);
  }, [activeFilter, loadPosts]); // Incluir loadPosts como dependencia

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
          <nav className="space-y-4 mb-16">            <Link href="/" className="block text-green-500 hover:text-green-400 text-lg font-medium">
              Inicio
            </Link>
            <Link href="/all-posts" className="block text-white hover:text-gray-300 text-lg">
              Todo
            </Link>
            <Link href="/tags" className="block text-white hover:text-gray-300 text-lg">
              Etiquetas
            </Link>
            <Link href="/debates" className="block text-white hover:text-gray-300 text-lg">
              Debates
            </Link>
            <Link href="/semanal" className="block text-white hover:text-gray-300 text-lg">
              Semanal
            </Link>
            <Link href="/biblioteca" className="block text-white hover:text-gray-300 text-lg">
              Biblioteca
            </Link>
          </nav>

          {/* Bottom Navigation */}          <nav className="space-y-4 absolute bottom-6">
            <Link href="/create-post" className="block text-white hover:text-gray-300 text-lg">
              Crear Publicación
            </Link>
            <Link href="/sugerencias" className="block text-white hover:text-gray-300 text-lg">
              Sugerencias
            </Link>
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
                  }}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Lista de posts - Nuevo diseño sin botón de estrella */}
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
                      <div className="flex items-center">
                        {/* Votos a la izquierda */}
                        <div className="w-16 text-center mr-4">
                          <div className="font-bold text-green-500">{post.upvotes}</div>
                          <div className="text-xs text-gray-400">votos</div>
                        </div>

                        {/* Título con espacio flexible */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-medium text-white truncate">{post.title}</h2>
                        </div>

                        {/* Autor y tiempo a la derecha con tamaño fijo */}
                        <div className="ml-4 flex flex-col items-end min-w-[120px]">
                          <span className="text-sm text-gray-300 truncate">{post.author}</span>
                          <span className="text-xs text-gray-400">{post.timeAgo}</span>
                        </div>
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
            )}          </main>

          {/* Sección Sobre el Proyecto */}
          <section id="sobre-proyecto" className="p-6 max-w-4xl mx-auto mt-16 mb-20 border-t border-gray-800 pt-16">
            <h1 className="text-4xl font-bold mb-8 text-green-500">Sobre el Proyecto</h1>

            <div className="text-gray-200">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                <div className="md:w-1/3">
                  <Image
                    src="/Logo1-Oscuro.png"
                    alt="Logo de Hyppo"
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                </div>

                <div className="md:w-2/3">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Visión y Propósito</h2>
                  <p className="mb-4 leading-relaxed">
                    Hyppo es un MVP (Producto Mínimo Viable) que representa el primer paso de un conjunto de ideas mucho más amplias.
                    Buscamos crear un espacio digital donde el pensamiento crítico, la argumentación rigurosa y el intercambio respetuoso
                    de ideas sean el centro de todas las interacciones.
                  </p>
                  <p className="leading-relaxed">
                    A diferencia de las redes sociales tradicionales, Hyppo está diseñado para fomentar conversaciones
                    profundas y significativas, priorizando la calidad sobre la cantidad, y la reflexión sobre la reacción inmediata.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">Nuestros Principios</h2>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li><span className="text-green-400 font-semibold">Pensamiento crítico:</span> Fomentamos el análisis riguroso y la evaluación de ideas basadas en evidencia.</li>
                <li><span className="text-green-400 font-semibold">Diálogo constructivo:</span> Creemos en la importancia del intercambio respetuoso de perspectivas diversas.</li>
                <li><span className="text-green-400 font-semibold">Transparencia:</span> Nuestros procesos y decisiones son abiertos y explicables.</li>
                <li><span className="text-green-400 font-semibold">Accesibilidad:</span> El conocimiento y las herramientas para el pensamiento crítico deben estar al alcance de todos.</li>
                <li><span className="text-green-400 font-semibold">Mejora continua:</span> Tanto la plataforma como nuestra comunidad están en constante evolución y aprendizaje.</li>
              </ul>

              <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-8 mb-12">
                <div className="md:w-1/3">
                  <Image
                    src="/globe.svg"
                    alt="Comunidad global"
                    width={250}
                    height={250}
                    className="p-4"
                  />
                </div>

                <div className="md:w-2/3">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Nuestra Comunidad</h2>
                  <p className="mb-4 leading-relaxed">
                    Hyppo está dirigido a personas interesadas en compartir y desarrollar ideas de manera rigurosa y respetuosa.
                    Damos la bienvenida a estudiantes, académicos, profesionales y cualquier persona con curiosidad intelectual
                    y disposición para participar en conversaciones constructivas.
                  </p>
                  <p className="leading-relaxed">
                    Valoramos la diversidad de perspectivas y experiencias, reconociendo que el verdadero aprendizaje
                    ocurre cuando nos exponemos a ideas diferentes a las nuestras.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">Sobre la Marca</h2>
              <p className="mb-4 leading-relaxed">
                El nombre "Hyppo" deriva de "hipótesis", un concepto fundamental en el método científico y el pensamiento crítico.
                Representa nuestra creencia en la importancia de formular, probar y refinar ideas a través del diálogo y la evidencia.
              </p>
              <p className="mb-8 leading-relaxed">
                Nuestro logotipo simboliza la conexión entre ideas y personas, así como el proceso iterativo de refinamiento
                del pensamiento a través del intercambio constructivo.
              </p>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                <div className="md:w-1/3">
                  <Image
                    src="/file.svg"
                    alt="Documentación y recursos"
                    width={250}
                    height={250}
                    className="p-4"
                  />
                </div>

                <div className="md:w-2/3">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Inspiraciones</h2>
                  <p className="mb-4 leading-relaxed">
                    Hyppo se inspira en diversos espacios de intercambio intelectual, tanto digitales como tradicionales:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Plataformas como LessWrong y el Foro de Alineación de IA</li>
                    <li>Comunidades académicas y científicas</li>
                    <li>Tradiciones filosóficas de diálogo socrático</li>
                    <li>Espacios digitales centrados en el debate estructurado</li>
                  </ul>
                  <p className="leading-relaxed">
                    Buscamos combinar lo mejor de estas influencias mientras desarrollamos nuestro propio enfoque único.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">Futuro y Desarrollo</h2>
              <p className="mb-4 leading-relaxed">
                Como MVP, Hyppo está en constante evolución. Nuestros planes de desarrollo incluyen:
              </p>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li>Herramientas avanzadas para estructurar y visualizar argumentos</li>
                <li>Sistemas de reputación basados en la calidad de las contribuciones</li>
                <li>Funcionalidades para la colaboración en proyectos de investigación</li>
                <li>Integración con recursos educativos y herramientas de verificación de hechos</li>
                <li>Expansión de la biblioteca de recursos sobre pensamiento crítico</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">Licencia</h2>
              <p className="mb-8 leading-relaxed">
                Hyppo es un proyecto de código abierto bajo la licencia GPLv3. Creemos en la transparencia
                y en la colaboración como valores fundamentales, y queremos que nuestra plataforma refleje estos principios
                desde su base tecnológica.
              </p>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">Participa</h2>
                <p className="mb-4 leading-relaxed">
                  Nos encontramos en una etapa temprana y tu participación puede marcar una gran diferencia.
                  Hay muchas formas de contribuir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Compartiendo tus ideas y publicaciones en la plataforma</li>
                  <li>Participando en debates constructivos</li>
                  <li>Proporcionando retroalimentación sobre la experiencia de usuario</li>
                  <li>Sugiriendo nuevas características o mejoras</li>
                  <li>Contribuyendo al código si tienes habilidades técnicas</li>
                </ul>
                <div className="mt-6">
                  <Link href="/sugerencias">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Enviar sugerencias
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
