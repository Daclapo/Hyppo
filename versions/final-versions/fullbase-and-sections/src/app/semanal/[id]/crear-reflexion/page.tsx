"use client"

import React, { useState, useEffect, FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import UserMenuNew from "@/components/UserMenuNew"
import MarkdownEditor from "@/components/MarkdownEditor"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

// Definir el tipo correcto para los params en Next.js 15
interface RouteParams {
  id: string;
}

interface WeeklyPost {
  id: string;
  title: string;
  weekLabel: string;
}

export default function CreateReflectionPage({ params }: { params: Promise<RouteParams> }) {
  // Usar React.use para acceder a params en un componente cliente (Next.js 15)
  const resolvedParams = React.use(params);
  const postId = resolvedParams.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [weeklyPost, setWeeklyPost] = useState<WeeklyPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();

  // Redireccionar si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  // Cargar información de la publicación semanal
  useEffect(() => {
    const fetchWeeklyPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("weekly_posts")
          .select("id, title, year, week_number")
          .eq("id", postId)
          .single();

        if (error) {
          console.error("Error al cargar la publicación semanal:", error);
          setError("No se pudo cargar la publicación semanal");
          return;
        }

        if (data) {
          // Generar etiqueta de semana
          const weekLabel = getWeekLabel(data.week_number, data.year);

          setWeeklyPost({
            id: data.id,
            title: data.title,
            weekLabel
          });
        }
      } catch (err) {
        console.error("Error inesperado al cargar la publicación semanal:", err);
        setError("Error al cargar datos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyPost();
  }, [postId, supabase]);

  // Manejar envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user || !weeklyPost) {
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setSubmitting(true);
    setError("");    try {
      // Insertar nueva reflexión
      const { data, error } = await supabase
        .from("weekly_reflections")
        .insert({
          weekly_post_id: weeklyPost.id,
          user_id: user.id,
          title: title.trim(),
          content: content.trim()
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error al publicar reflexión:", error);
        setError("Error al publicar. Por favor, intenta de nuevo.");
        setSubmitting(false);
        return;
      }

      // Redireccionar a la página de la reflexión
      if (data) {
        router.push(`/semanal/reflexion/${data.id}`);
      }
    } catch (err) {
      console.error("Error inesperado al publicar reflexión:", err);
      setError("Error al publicar. Por favor, intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!user) {
    return <div className="text-center py-12 text-gray-400">Redirigiendo al inicio de sesión...</div>;
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
          <UserMenuNew />
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
              <div className="text-center py-12 text-gray-400">Cargando...</div>
            ) : !weeklyPost ? (
              <div className="text-center py-12 text-gray-400">
                Publicación semanal no encontrada.
                <div className="mt-4">
                  <Link href="/semanal">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Volver a Semanal
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Encabezado */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-4">Añadir una reflexión</h1>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-green-500 font-medium">{weeklyPost.weekLabel}</div>
                    <h2 className="text-xl text-white">{weeklyPost.title}</h2>
                  </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-white">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                      Título de tu reflexión
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      placeholder="Escribe un título claro y descriptivo"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">
                      Contenido (admite formato Markdown)
                    </label>
                    <MarkdownEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Escribe tu reflexión aquí..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Link href={`/semanal/${weeklyPost.id}`}>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-800 text-white"
                      >
                        Cancelar
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={submitting || !title.trim() || !content.trim()}
                    >
                      {submitting ? "Publicando..." : "Publicar reflexión"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
