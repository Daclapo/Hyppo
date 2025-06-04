"use client"

import { useState, useEffect, FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import UserMenuNew from "@/components/UserMenuNew"
import MarkdownEditor from "@/components/MarkdownEditor"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function CreateWeeklyPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [weekNumber, setWeekNumber] = useState(getCurrentWeek());
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
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

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;

      setAdminLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("admin")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error al verificar privilegios de administrador:", error);
          return;
        }

        setIsAdmin(data?.admin || false);

        // Si no es admin, redirigir
        if (!data?.admin) {
          router.push("/semanal");
        }
      } catch (err) {
        console.error("Error inesperado al verificar privilegios:", err);
      } finally {
        setAdminLoading(false);
      }
    };

    checkIfAdmin();
  }, [user, supabase, router]);

  // Obtener el número de semana actual
  function getCurrentWeek() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000; // milisegundos en una semana
    return Math.ceil(diff / oneWeek);
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user || !isAdmin) {
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Verificar si ya existe una publicación para esta semana y año
      const { data: existingPost, error: checkError } = await supabase
        .from("weekly_posts")
        .select("id")
        .eq("year", year)
        .eq("week_number", weekNumber)
        .maybeSingle();      if (checkError) {
        console.error("Error al verificar publicaciones existentes:", checkError.message || JSON.stringify(checkError));
        setError(`Error al verificar duplicados: ${checkError.message || 'Verifica que las tablas existan en la base de datos'}`);
        return;
      }

      if (existingPost) {
        setError(`Ya existe una publicación para la semana ${weekNumber} del año ${year}`);
        return;
      }

      // Insertar nueva publicación semanal
      const { data, error } = await supabase
        .from("weekly_posts")
        .insert({
          title: title.trim(),
          content: content.trim(),
          year,
          week_number: weekNumber
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error al crear publicación semanal:", error.message || JSON.stringify(error));
        setError(`Error al publicar: ${error.message || 'Verifica que las tablas existan en la base de datos'}`);
        return;
      }

      // Redireccionar a la página de la publicación
      if (data) {
        router.push(`/semanal/${data.id}`);
      }
    } catch (err) {
      console.error("Error inesperado al crear publicación semanal:", err);
      setError("Error al publicar. Por favor, intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12 text-gray-400">Redirigiendo al inicio de sesión...</div>;
  }

  if (adminLoading) {
    return <div className="text-center py-12 text-gray-400">Verificando permisos...</div>;
  }

  if (!isAdmin) {
    return <div className="text-center py-12 text-gray-400">Redirigiendo... Solo administradores pueden acceder a esta página.</div>;
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
            {/* Encabezado */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Crear publicación semanal</h1>
              <p className="text-gray-300">
                Como administrador, puedes crear una nueva publicación semanal para que los usuarios
                compartan sus reflexiones. Estas publicaciones aparecerán en la sección "Semanal".
              </p>
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
                  Título de la publicación semanal
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
                  placeholder="Describe el tema semanal o plantea una pregunta para reflexionar..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-400 mb-1">
                    Año
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    min="2024"
                    max="2030"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-400 mb-1">
                    Número de semana
                  </label>
                  <input
                    type="number"
                    id="weekNumber"
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    min="1"
                    max="53"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/semanal">
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
                  {submitting ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}
