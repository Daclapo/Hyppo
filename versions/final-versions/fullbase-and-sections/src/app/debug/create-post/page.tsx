"use client"

import React, { useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import SimpleTest from './simple-test'

export default function DebugPostCreationPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<Array<{size: number, success: boolean, message: string, time: number}>>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const testSizes = [100, 500, 1000, 5000, 10000, 20000, 50000]

  const runTest = async () => {
    if (!user) {
      setError("Debes iniciar sesión para ejecutar esta prueba")
      return
    }

    setLoading(true)
    setResults([])
    setError(null)

    const newResults = []

    for (const size of testSizes) {
      try {
        console.log(`Probando con contenido de ${size} caracteres...`)

        // Generar título y contenido de prueba
        const title = `Test ${size} chars - ${new Date().toISOString().substring(11, 19)}`
        const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(Math.ceil(size / 50))

        const startTime = performance.now()

        // Intentar crear la publicación
        const { data, error } = await supabase
          .from("posts")
          .insert({
            user_id: user.id,
            title,
            content: content.substring(0, size),
            upvote_count: 0
          })
          .select()

        const endTime = performance.now()
        const elapsed = endTime - startTime

        if (error) {
          console.error(`Error al crear post de ${size} caracteres:`, error)
          newResults.push({
            size,
            success: false,
            message: `Error: ${error.message}`,
            time: elapsed
          })
        } else {
          console.log(`Post creado con éxito. Tamaño: ${size}`)
          newResults.push({
            size,
            success: true,
            message: `Éxito. ID: ${data[0]?.id}`,
            time: elapsed
          })
        }
      } catch (err) {
        console.error(`Error inesperado con tamaño ${size}:`, err)
        newResults.push({
          size,
          success: false,
          message: `Error inesperado: ${err instanceof Error ? err.message : String(err)}`,
          time: 0
        })
      }

      // Actualizar resultados después de cada prueba
      setResults([...newResults])

      // Pequeña pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Diagnóstico de Creación de Publicaciones</h1>
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-md">
          Debes iniciar sesión para usar esta herramienta.
          <div className="mt-4">
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Iniciar sesión</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Creación de Publicaciones</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <p className="mb-4">
          Esta herramienta prueba la creación de publicaciones con diferentes tamaños de contenido para diagnosticar problemas.
        </p>

        <Button
          onClick={runTest}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Ejecutando pruebas..." : "Ejecutar pruebas"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Resultados:</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-left">Tamaño (caracteres)</th>
                  <th className="p-3 text-left">Resultado</th>
                  <th className="p-3 text-left">Tiempo (ms)</th>
                  <th className="p-3 text-left">Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                    <td className="p-3">{result.size}</td>
                    <td className="p-3">
                      <span className={result.success ? "text-green-500" : "text-red-500"}>
                        {result.success ? "✓ Éxito" : "✗ Error"}
                      </span>
                    </td>
                    <td className="p-3">{result.time.toFixed(2)}</td>
                    <td className="p-3 break-all">{result.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Análisis:</h3>
            <p>
              {results.every(r => r.success)
                ? "✅ Todas las pruebas fueron exitosas. No se detectaron problemas con el tamaño del contenido."
                : "❌ Se detectaron errores en algunas pruebas. Revisa los mensajes de error para más detalles."}
            </p>

            {results.some(r => !r.success) && (
              <div className="mt-4">
                <p className="font-semibold">Recomendaciones:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Verifica los límites de tamaño en la base de datos</li>
                  <li>Comprueba si hay restricciones en las políticas de seguridad (RLS)</li>
                  <li>Revisa el tiempo de espera de las peticiones al servidor</li>
                </ul>
              </div>            )}
          </div>
        </div>
      )}

      {/* Prueba simplificada */}
      <SimpleTest />

      <div className="mt-8">
        <Link href="/">
          <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}
