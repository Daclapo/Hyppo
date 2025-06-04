"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface EditProfileModalProps {
  profileId: string
  initialBio: string | null
  onClose: () => void
  onSave: (bio: string | null) => void
}

export default function EditProfileModal({
  profileId,
  initialBio,
  onClose,
  onSave
}: EditProfileModalProps) {
  const [bio, setBio] = useState(initialBio || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Si se hace clic fuera del modal, cerrar
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          bio: bio.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId)

      if (updateError) {
        throw updateError
      }

      onSave(bio.trim() || null)
    } catch (err) {
      console.error('Error al actualizar el perfil:', err)
      setError('Ocurrió un error al guardar los cambios')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium text-white">Editar perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium mb-1 text-gray-400">
              Biografía
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-md min-h-[100px]"
              placeholder="Cuéntanos algo sobre ti (opcional)"
              maxLength={300}
            />
            <p className="text-xs text-gray-400 mt-1">
              {bio.length}/300 caracteres
            </p>
          </div>          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={onClose}
              className="border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
