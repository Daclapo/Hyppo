"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    // Validar el nombre de usuario (solo letras, números y guiones bajos)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("El nombre de usuario solo puede contener letras, números y guiones bajos")
      setLoading(false)
      return
    }

    try {
      // Verificar si el nombre de usuario ya existe
      const { data: existingUser, error: usernameError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single()

      if (existingUser) {
        setError("Este nombre de usuario ya está en uso")
        setLoading(false)
        return
      }

      // Crear usuario en auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username, // Guardar el nombre de usuario en los metadatos
          },
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      // El perfil se creará automáticamente mediante un trigger en Supabase

      // Redireccionar a la página principal después de registrarse
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Error durante el registro:", err)
      setError("Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.")
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
          <h1 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h1>

          {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Nombre de usuario
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white w-full"
                placeholder="usuario123"
              />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirmar contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-green-500 hover:text-green-400">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
