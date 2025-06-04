'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface DebatesClientProps {
  session: Session | null;
}

export default function DebatesClient({ session }: DebatesClientProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('Debes iniciar sesión para crear una pregunta de debate');
      return;
    }

    if (!title.trim()) {
      alert('El título de la pregunta no puede estar vacío');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('debate_questions')
        .insert({
          user_id: session.user.id,
          title: title.trim(),
          content: content.trim()
        })
        .select();

      if (error) {
        throw error;
      }

      setTitle('');
      setContent('');
      setIsCreating(false);
      router.refresh();
    } catch (error) {
      console.error('Error al crear la pregunta:', error);
      alert('Error al crear la pregunta de debate. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      {isCreating ? (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Crear nueva pregunta de debate</h2>

	    <div className="mb-4">
		<label htmlFor="title" className="block text-sm font-medium mb-1">
		Título de la pregunta
		</label>
		<div className="relative">
		<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¿</span>
		<input
			id="title"
			type="text"
			className="w-full p-3 pl-8 pr-8 border rounded-md bg-background"
			value={title}
			onChange={(e) => setTitle(e.target.value)}
			placeholder="Escribe el título de la pregunta..."
			disabled={isSubmitting}
		/>
		<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">?</span>
		</div>
		</div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Descripción o contexto (opcional)
            </label>
            <textarea
              id="content"
              className="w-full p-3 border rounded-md bg-background"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Añade contexto, reflexiones o referencias para enriquecer la pregunta..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsCreating(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar pregunta'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsCreating(true)}
            disabled={!session}
            className="px-6"
          >
            {session ? 'Crear nueva pregunta de debate' : 'Inicia sesión para crear una pregunta'}          </Button>
        </div>
      )}
    </div>
  );
}
