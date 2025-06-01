"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      // Redireccionar a la página principal después de iniciar sesión
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err)
      setError("Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar básico */}
      <nav className="flex justify-between items-center p-6 bg-black">
        <Link href="/">
          <div className="flex items-center">
            <Image src="/logo1-Oscuro.png" alt="Logo" width={48} height={48} className="rounded-lg mr-2" />
          </div>
        </Link>
      </nav>

      {/* Contenido principal */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

          {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white w-full"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white w-full"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 text-white hover:bg-green-500 transition-colors"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>
              ¿No tienes una cuenta?{" "}
              <Link href="/signup" className="text-green-500 hover:text-green-400">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
