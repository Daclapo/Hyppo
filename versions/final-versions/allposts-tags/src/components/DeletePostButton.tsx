"use client"

import { useState } from 'react'
import { createClient } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"

interface DeletePostButtonProps {
  postId: string
  onSuccess?: () => void
}

export default function DeletePostButton({ postId, onSuccess }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setIsDeleting(true)
      setError(null)

      // Eliminar la publicación de Supabase
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (deleteError) {
        console.error("Error al eliminar la publicación:", deleteError)
        setError("No se pudo eliminar la publicación")
        return
      }

      // Notificar éxito
      if (onSuccess) {
        onSuccess()
      }

    } catch (err) {
      console.error("Error al eliminar la publicación:", err)
      setError("Ocurrió un error inesperado")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 p-1 rounded-full"
      aria-label="Eliminar publicación"
      title="Eliminar publicación"
    >
      {isDeleting ? (
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  )
}
