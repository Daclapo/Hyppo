import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0
          })
        }
      }
    }
  )

  // Refresh session if expired and ensure cookies are properly set
  await supabase.auth.getSession()

  return response
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
