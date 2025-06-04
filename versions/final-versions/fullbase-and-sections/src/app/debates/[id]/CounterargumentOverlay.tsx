'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface CounterargumentOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  argument: {
    id: string;
    content: string;
    is_in_favor: boolean;
    intensity: number;
    created_at: string;
    profiles: {
      username: string;
    } | null;
  };
  session: { user: User } | null;
}

export default function CounterargumentOverlay({ isOpen, onClose, argument, session }: CounterargumentOverlayProps) {
  const [counterarguments, setCounterarguments] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  // Cargar contraargumentos
  useEffect(() => {
    if (isOpen && argument) {
      fetchCounterarguments();
    }
  }, [isOpen, argument]);

  const fetchCounterarguments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('debate_counterarguments')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq('argument_id', argument.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCounterarguments(data || []);
    } catch (error) {
      console.error('Error al cargar contraargumentos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('Debes iniciar sesión para añadir un contraargumento');
      return;
    }

    if (!content.trim()) {
      alert('El contraargumento no puede estar vacío');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('debate_counterarguments')
        .insert({
          argument_id: argument.id,
          user_id: session.user.id,
          content: content.trim()
        })
        .select();

      if (error) {
        throw error;
      }

      setContent('');
      // Es importante asegurar que se desactive el estado de isSubmitting antes de fetchCounterarguments
      setIsSubmitting(false);
      await fetchCounterarguments();
      
      // Confirmar al usuario que se ha añadido el contraargumento
      console.log('Contraargumento añadido correctamente:', data);
    } catch (error) {
      console.error('Error al añadir el contraargumento:', error);
      alert('Error al añadir el contraargumento. Por favor, intenta de nuevo más tarde.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">
              Respuestas a un argumento {argument.is_in_favor ? 'a favor' : 'en contra'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mostrar el argumento original */}
          <div className={`p-4 rounded-lg mb-6 ${argument.is_in_favor ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownRenderer content={argument.content} />
            </div>
            <div className="mt-3 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Por {argument.profiles?.username} · {new Date(argument.created_at).toLocaleDateString()}
              </span>
              <span className={`font-medium ${
                argument.is_in_favor ? 
                  (argument.intensity === 1 ? 'text-green-400' : 
                   argument.intensity === 2 ? 'text-green-500' : 
                   'text-green-600 font-bold') :
                  (argument.intensity === 1 ? 'text-red-400' : 
                   argument.intensity === 2 ? 'text-red-500' : 
                   'text-red-600 font-bold')
              }`}>
                {argument.is_in_favor ? 
                  (argument.intensity === 1 ? 'Algo a favor' : 
                   argument.intensity === 2 ? 'A favor' : 
                   'Muy a favor') :
                  (argument.intensity === 1 ? 'Algo en contra' : 
                   argument.intensity === 2 ? 'En contra' : 
                   'Muy en contra')
                }
              </span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Respuestas</h3>

          {/* Lista de contraargumentos */}
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <p className="text-center py-4">Cargando respuestas...</p>
            ) : counterarguments.length > 0 ? (
              counterarguments.map((counterargument) => (
                <div key={counterargument.id} className="bg-card p-4 rounded-lg shadow">
                  <div className="whitespace-pre-wrap break-words">
                    {counterargument.content}
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Por {counterargument.profiles?.username} · {new Date(counterargument.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No hay respuestas aún. ¡Sé el primero en responder!</p>
            )}
          </div>

          {/* Formulario para añadir contraargumentos */}
          {session ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <textarea
                  className="w-full p-3 border rounded-lg bg-background focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className={`transition-all duration-200 shadow-sm focus:ring-2 focus:ring-blue-400 ${isSubmitting ? 'opacity-70' : ''}`}
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar respuesta'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">Debes iniciar sesión para responder a este argumento</p>
              <Button
                onClick={() => window.location.href = '/login'}
                className="px-6"
              >
                Iniciar sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
