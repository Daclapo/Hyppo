"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export default function TestSimplePostCreation() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  // Tamaño del contenido a probar (10,000 caracteres)
  const testSize = 10000

  const runSimpleTest = async () => {
    if (!user) {
      setResult({
        success: false,
        message: "Necesitas iniciar sesión para realizar esta prueba"
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      console.log(`Iniciando prueba simple con ${testSize} caracteres...`)

      // Generar título y contenido de prueba
      const title = `Test simple ${new Date().toISOString()}`
      const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(Math.ceil(testSize / 50))

      console.log(`Tamaño real del contenido: ${content.length} caracteres`)

      // Inserción directa sin validaciones adicionales
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          title,
          content: content.substring(0, testSize),
          upvote_count: 0
        })
        .select()

      if (error) {
        console.error("Error en la prueba simple:", error)
        setResult({
          success: false,
          message: `Error: ${error.message}`
        })
      } else {
        console.log("Prueba simple exitosa:", data)
        setResult({
          success: true,
          message: `Publicación creada con éxito. ID: ${data[0]?.id}`
        })
      }
    } catch (err) {
      console.error("Error inesperado:", err)
      setResult({
        success: false,
        message: `Error inesperado: ${err instanceof Error ? err.message : String(err)}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Prueba simple de creación</h2>
      <p className="mb-4">
        Esta prueba intenta crear una publicación directamente con {testSize.toLocaleString()} caracteres,
        evitando componentes complejos como el editor de markdown.
      </p>

      <Button
        onClick={runSimpleTest}
        disabled={loading || !user}
        className="bg-green-600 hover:bg-green-700 mb-4"
      >
        {loading ? "Creando publicación..." : "Ejecutar prueba simple"}
      </Button>

      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
          <p className={result.success ? 'text-green-300' : 'text-red-300'}>
            {result.message}
          </p>
        </div>
      )}
    </div>
  )
}
