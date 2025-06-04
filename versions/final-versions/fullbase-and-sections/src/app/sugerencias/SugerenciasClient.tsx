'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SugerenciasClientProps {
  session: Session | null;
}

export default function SugerenciasClient({ session }: SugerenciasClientProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('Debes iniciar sesión para enviar una sugerencia');
      return;
    }

    if (!content.trim()) {
      alert('La sugerencia no puede estar vacía');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('suggestions')
        .insert({
          user_id: session.user.id,
          content: content.trim()
        });

      if (error) {
        throw error;
      }

      setContent('');
      router.refresh();
    } catch (error) {
      console.error('Error al enviar la sugerencia:', error);
      alert('Error al enviar la sugerencia. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Enviar una sugerencia</h2>

      {session ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="w-full p-3 border rounded-md bg-background"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu sugerencia aquí..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar sugerencia'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">Debes iniciar sesión para enviar una sugerencia</p>
          <Button
            onClick={() => window.location.href = '/login'}
            className="px-6"
          >
            Iniciar sesión
          </Button>
        </div>
      )}
    </div>
  );
}
