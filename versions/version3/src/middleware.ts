import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/profile',
  '/new-post',
  '/edit-profile',
];

// Rutas de autenticación (redirigir si ya está autenticado)
const authRoutes = [
  '/login',
  '/signup',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Verificar si el usuario está autenticado
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;

  // Redirigir a login si intenta acceder a rutas protegidas sin autenticación
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirigir al home si está autenticado e intenta acceder a rutas de auth
  if (session && authRoutes.some(route => pathname === route)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// Configurar el middleware para que se aplique solo a ciertas rutas
export const config = {
  matcher: [
    /*
     * Rutas que coincidan con:
     * - Todas las rutas protegidas
     * - Las rutas de autenticación (login, signup)
     * No coinciden con:
     * - Rutas de API
     * - Archivos estáticos (imágenes, favicons, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
