import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        }
      }
    }
  )

  // IMPORTANTE: Necesitas escribir cualquier mutación de cookies antes de obtener la sesión
  // La referencia del usuario debe ser refrescada cuando los cookies cambien
  const {
    data: { user }
  } = await supabase.auth.getUser()
  // Rutas protegidas - requieren autenticación
  const protectedRoutes = ['/profile', '/create-post']

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Si no hay usuario y está intentando acceder a una ruta protegida
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay usuario y está en login/signup, redirigir a home
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const redirectUrl = new URL('/', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

// Aplicar el middleware solo a rutas específicas
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api/* (rutas de API)
     * 2. /_next/static (archivos estáticos)
     * 3. /_next/image (optimización de imágenes)
     * 4. /favicon.ico, /sitemap.xml (archivos específicos)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml).*)',
  ],
}
