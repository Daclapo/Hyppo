'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import CounterargumentOverlay from './CounterargumentOverlay';

interface Argument {
  id: string;
  content: string;
  is_in_favor: boolean;
  intensity: number;
  created_at: string;
  profiles: {
    username: string;
  } | null;
  counterarguments_count?: number;
}

interface ArgumentsResponsesProps {
  inFavorArguments: Argument[];
  againstArguments: Argument[];
  session: Session | null;
}

export default function ArgumentResponses({ inFavorArguments, againstArguments, session }: ArgumentsResponsesProps) {
  const [selectedArgument, setSelectedArgument] = useState<Argument | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [argumentsList, setArgumentsList] = useState<Argument[]>([]);
  const supabase = createClient();

  // Inicializa los argumentos cuando el componente se monta
  useEffect(() => {
    const allArgs = [...inFavorArguments, ...againstArguments].map(arg => ({
      ...arg,
      counterarguments_count: 0
    }));
    setArgumentsList(allArgs);
    loadCounterargumentsCounts(allArgs);

    // Agregar event listeners para los botones de respuesta
    document.querySelectorAll('[data-argument-id]').forEach(button => {
      button.addEventListener('click', handleArgumentButtonClick);
    });

    return () => {
      // Limpiar event listeners
      document.querySelectorAll('[data-argument-id]').forEach(button => {
        button.removeEventListener('click', handleArgumentButtonClick);
      });
    };
  }, [inFavorArguments, againstArguments]);

  // Función para manejar clics en botones de argumento
  const handleArgumentButtonClick = useCallback((e: Event) => {
    const button = e.currentTarget as HTMLButtonElement;
    const argumentId = button.getAttribute('data-argument-id');
    if (!argumentId) return;

    const argument = [...inFavorArguments, ...againstArguments].find(arg => arg.id === argumentId);
    if (argument) {
      setSelectedArgument(argument);
      setIsOverlayOpen(true);
    }
  }, [inFavorArguments, againstArguments]);

  // Función para cargar el recuento de contraargumentos para cada argumento
  const loadCounterargumentsCounts = async (args: Argument[]) => {
    for (const argument of args) {
      try {
        const { data, error } = await supabase.rpc(
          'count_debate_counterarguments',
          { argument_id: argument.id }
        );

        if (!error && data !== null) {
          // Actualizar el contador en el botón
          const button = document.querySelector(`[data-argument-id="${argument.id}"]`);
          if (button && data > 0) {
            button.textContent = `Ver respuestas (${data})`;
          }

          setArgumentsList(prev =>
            prev.map(arg =>
              arg.id === argument.id
                ? { ...arg, counterarguments_count: data }
                : arg
            )
          );
        }
      } catch (error) {
        console.error(`Error al contar contraargumentos para el argumento ${argument.id}:`, error);
      }
    }
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    loadCounterargumentsCounts([...inFavorArguments, ...againstArguments]); // Actualizar recuentos al cerrar
  };

  return (
    <>
      {selectedArgument && (
        <CounterargumentOverlay
          isOpen={isOverlayOpen}
          onClose={closeOverlay}
          argument={selectedArgument}
          session={session}
        />
      )}
    </>
  );
}
