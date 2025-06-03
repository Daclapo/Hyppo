"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import UserMenuNew from "@/components/UserMenuNew"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/AuthContext"

// Tipo para publicaciones semanales
interface WeeklyPost {
  id: string;
  title: string;
  weekLabel: string;
  year: number;
  week_number: number;
  created_at: string;
}

export default function SemanalPage() {
  const [weeklyPosts, setWeeklyPosts] = useState<WeeklyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { user } = useAuth();

  // Cargar publicaciones al iniciar
  useEffect(() => {
    async function loadWeeklyPosts() {
      setLoading(true);
      setError(null);
      try {
        // Obtener publicaciones semanales ordenadas por año y semana
        const { data, error } = await supabase
          .from("weekly_posts")
          .select("id, title, year, week_number, created_at")
          .order("year", { ascending: false })
          .order("week_number", { ascending: false });

        if (error) {
          console.error("Error al cargar publicaciones semanales:", error.message || JSON.stringify(error));
          // Si el error es que la tabla no existe, mostramos un mensaje específico pero no bloqueamos la carga
          if (error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
            setWeeklyPosts([]);
            setError("La tabla de publicaciones semanales no existe en la base de datos.");
          } else {
            setError(`Error al cargar publicaciones: ${error.message}`);
          }
          return;
        }

        // Si no hay datos, simplemente devolver un array vacío
        if (!data || data.length === 0) {
          setWeeklyPosts([]);
          return;
        }

        // Formatear datos para mostrar
        const formattedPosts = data.map((post) => {
          try {
            // Generar etiqueta de semana (ej: "Segunda semana de abril 2024")
            const weekLabel = getWeekLabel(post.week_number, post.year);

            return {
              id: post.id,
              title: post.title,
              weekLabel,
              year: post.year,
              week_number: post.week_number,
              created_at: post.created_at
            };
          } catch (error) {
            console.error(`Error al procesar publicación ${post.id}:`, error);
            // Devolver una versión simplificada si hay error en el procesamiento
            return {
              id: post.id,
              title: post.title,
              weekLabel: `Semana ${post.week_number} de ${post.year}`,
              year: post.year,
              week_number: post.week_number,
              created_at: post.created_at
            };
          }
        });

        setWeeklyPosts(formattedPosts);
      } catch (err) {
        console.error("Error inesperado al cargar publicaciones semanales:", err);
        // Mostrar mensaje más detallado del error
        if (err instanceof Error) {
          console.error("Detalle del error:", err.message);
          setError(`Error al cargar los datos: ${err.message}`);
        } else {
          setError("Ocurrió un error desconocido al cargar las publicaciones");
        }
      } finally {
        setLoading(false);
      }
    }

    loadWeeklyPosts();
  }, [supabase]); // Solo depende de supabase

  // Función para generar etiqueta de semana
  function getWeekLabel(weekNumber: number, year: number): string {
    const monthNames = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    // Obtener fecha a partir del número de semana y año
    const date = getDateOfWeek(weekNumber, year);
    const month = date.getMonth();

    // Determinar ordinal de la semana en el mes
    const weekOfMonth = Math.ceil(date.getDate() / 7);
    const weekOrdinal = ["Primera", "Segunda", "Tercera", "Cuarta", "Quinta"][weekOfMonth - 1] || "Última";

    return `${weekOrdinal} semana de ${monthNames[month]} ${year}`;
  }

  // Función auxiliar para obtener fecha a partir de número de semana y año
  function getDateOfWeek(week: number, year: number): Date {
    const date = new Date(year, 0, 1);
    date.setDate(date.getDate() + (week - 1) * 7);
    return date;
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Publicaciones Semanales</h1>
              <p className="text-gray-300 text-lg">
                Cada semana publicamos un artículo o pregunta de reflexión. Los usuarios pueden
                compartir sus pensamientos y debatir sobre estos temas en un formato estructurado.
              </p>
            </div>

            {/* Lista de publicaciones semanales */}
            {loading ? (
              <div className="text-center py-12 text-gray-400">Cargando publicaciones semanales...</div>
            ) : weeklyPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No hay publicaciones semanales disponibles.
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                {weeklyPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 bg-gray-800 rounded-lg transition-colors hover:bg-gray-700 border border-gray-700"
                  >
                    <Link href={`/semanal/${post.id}`}>
                      <div className="space-y-2">
                        <div className="text-green-500 font-medium">{post.weekLabel}</div>
                        <h2 className="text-xl font-medium text-white">{post.title}</h2>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            className="text-sm border-gray-600 hover:bg-gray-600"
                          >
                            Ver reflexiones
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Mensaje para administradores (agregar publicación semanal) */}
            {user && (
              <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-2">¿Eres administrador?</h2>
                <p className="text-gray-300 mb-4">
                  Si tienes permisos de administrador, puedes crear una nueva publicación semanal.
                </p>
                <Link href="/semanal/crear">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Crear nueva publicación semanal
                  </Button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
