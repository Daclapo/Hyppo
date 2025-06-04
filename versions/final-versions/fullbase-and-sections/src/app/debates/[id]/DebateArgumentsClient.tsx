'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface DebateArgumentsClientProps {
  questionId: string;
  session: Session | null;
}

export default function DebateArgumentsClient({ questionId, session }: DebateArgumentsClientProps) {
  const [content, setContent] = useState('');
  const [isInFavor, setIsInFavor] = useState(true);
  const [intensity, setIntensity] = useState<number>(2); // 1: algo, 2: neutro, 3: muy
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('Debes iniciar sesión para añadir un argumento');
      return;
    }    if (!content.trim()) {
      alert('El argumento no puede estar vacío');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('debate_arguments')
        .insert({
          question_id: questionId,
          user_id: session.user.id,
          content: content.trim(),
          is_in_favor: isInFavor,
          intensity: intensity
        })
        .select();

      if (error) {
        throw error;
      }

      setContent('');
      setIsSubmitting(false); // Aseguramos que se desactive el estado antes del refresh
      router.refresh();
      console.log('Argumento añadido correctamente:', data);
    } catch (error) {
      console.error('Error al añadir el argumento:', error);
      alert('Error al añadir el argumento. Por favor, intenta de nuevo más tarde.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Añadir un argumento</h2>

      {session ? (
        <form onSubmit={handleSubmit}>          <div className="mb-4">
            <textarea
              className="w-full p-3 border rounded-lg bg-background focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu argumento aquí..."
              disabled={isSubmitting}
            />
          </div><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Toggle para a favor / en contra */}
            <div>
              <label className="block text-sm font-medium mb-2">Postura:</label>
              <div className="flex bg-background border rounded-lg overflow-hidden shadow-sm">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center transition-all duration-200 ${
                    isInFavor
                      ? 'bg-green-600 text-white font-semibold shadow-inner'
                      : 'hover:bg-green-100 dark:hover:bg-green-900/30'
                  }`}
                  onClick={() => setIsInFavor(true)}
                >
                  A favor
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center transition-all duration-200 ${
                    !isInFavor
                      ? 'bg-red-600 text-white font-semibold shadow-inner'
                      : 'hover:bg-red-100 dark:hover:bg-red-900/30'
                  }`}
                  onClick={() => setIsInFavor(false)}
                >
                  En contra
                </button>
              </div>
            </div>

            {/* Selector de intensidad */}
            <div>
              <label className="block text-sm font-medium mb-2">Intensidad:</label>
              <div className="flex bg-background border rounded-lg overflow-hidden shadow-sm">
                <button
                  type="button"
                  className={`flex-1 py-2 text-center transition-all duration-200 ${
                    intensity === 1
                      ? (isInFavor ? 'bg-green-400' : 'bg-red-400') + ' text-white font-semibold shadow-inner'
                      : isInFavor ? 'hover:bg-green-100 dark:hover:bg-green-900/20' : 'hover:bg-red-100 dark:hover:bg-red-900/20'
                  }`}
                  onClick={() => setIntensity(1)}
                >
                  Algo
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-center transition-all duration-200 ${
                    intensity === 2
                      ? (isInFavor ? 'bg-green-500' : 'bg-red-500') + ' text-white font-semibold shadow-inner'
                      : isInFavor ? 'hover:bg-green-100 dark:hover:bg-green-900/20' : 'hover:bg-red-100 dark:hover:bg-red-900/20'
                  }`}
                  onClick={() => setIntensity(2)}
                >
                  Neutro
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-center transition-all duration-200 ${
                    intensity === 3
                      ? (isInFavor ? 'bg-green-600' : 'bg-red-600') + ' text-white font-semibold shadow-inner'
                      : isInFavor ? 'hover:bg-green-100 dark:hover:bg-green-900/20' : 'hover:bg-red-100 dark:hover:bg-red-900/20'
                  }`}
                  onClick={() => setIntensity(3)}
                >
                  Muy
                </button>
              </div>
            </div>
          </div>          <div className="flex justify-end">
          <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className={`shadow-sm transition-all duration-200 ${
                isInFavor
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-400'
              } ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? 'Publicando...' : `Publicar argumento ${isInFavor ? 'a favor' : 'en contra'}`}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">Debes iniciar sesión para añadir un argumento al debate</p>
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
