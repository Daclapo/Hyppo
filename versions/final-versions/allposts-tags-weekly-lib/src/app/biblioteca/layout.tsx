"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import UserMenuNew from "@/components/UserMenuNew"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

// Definir la estructura de los documentos de la biblioteca
const documentosDelaBiblioteca = [
  { id: "guia-nuevos-usuarios", title: "Guía de nuevos usuarios" },
  { id: "valores-principios", title: "Valores y principios de la plataforma" },
  { id: "conductas-deseadas", title: "Conductas deseadas" },
  { id: "codigos-logicos", title: "Códigos lógicos" },
  { id: "falacias-logicas", title: "Falacias lógicas comunes" },
  { id: "tolerancia", title: "Tolerancia" },
]

export default function BibliotecaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const pathname = usePathname()

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
        {/* Sidebar principal */}
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
            <Link href="/semanal" className="block text-white hover:text-gray-300 text-lg">
              Semanal
            </Link>
            <Link href="/biblioteca" className="block text-green-500 hover:text-green-400 text-lg font-medium">
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

        {/* Sidebar de Biblioteca */}
        <aside className="fixed top-20 left-64 w-64 p-6 h-screen bg-gray-900 pt-[88px] border-r border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-green-500">Biblioteca</h2>
          <nav className="space-y-3">
            {documentosDelaBiblioteca.map((doc) => (
              <Link
                key={doc.id}
                href={`/biblioteca/${doc.id}`}
                className={`block text-base py-2 px-3 rounded-lg transition-colors ${
                  pathname === `/biblioteca/${doc.id}`
                    ? "bg-gray-800 text-green-500"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                {doc.title}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <Link href="/biblioteca">
              <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800 text-white">
                Volver a la Biblioteca
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 mt-[88px] pl-[512px]">
          <main className="p-6 max-w-3xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
