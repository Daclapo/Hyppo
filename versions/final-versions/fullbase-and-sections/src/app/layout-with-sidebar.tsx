"use client"

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserMenuNew from '@/components/UserMenuNew';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function LayoutWithSidebar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Determina qué enlace está activo
  const isActive = (path: string) => {
    // Comprobamos si es la ruta exacta o si es una subruta (para secciones como /debates/[id])
    return pathname === path || (path !== '/' && pathname.startsWith(path));
  };

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
          <nav className="space-y-4 mb-16">
            <Link
              href="/"
              className={`block ${isActive('/') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Inicio
            </Link>
            <Link
              href="/all-posts"
              className={`block ${isActive('/all-posts') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Todo
            </Link>
            <Link
              href="/tags"
              className={`block ${isActive('/tags') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Etiquetas
            </Link>
            <Link
              href="/debates"
              className={`block ${isActive('/debates') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Debates
            </Link>
            <Link
              href="/semanal"
              className={`block ${isActive('/semanal') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Semanal
            </Link>
            <Link
              href="/biblioteca"
              className={`block ${isActive('/biblioteca') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Biblioteca
            </Link>
          </nav>

          {/* Bottom Navigation */}
          <nav className="space-y-4 absolute bottom-6">
            <Link
              href="/create-post"
              className={`block ${isActive('/create-post') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Crear Publicación
            </Link>
            <Link
              href="/sugerencias"
              className={`block ${isActive('/sugerencias') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Sugerencias
            </Link>            <Link
              href="/#sobre-proyecto"
              className={`block ${isActive('/#sobre-proyecto') ? 'text-green-500 font-medium' : 'text-white'} hover:text-green-400 text-lg`}
            >
              Sobre el Proyecto
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 mt-[88px] pl-64">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
