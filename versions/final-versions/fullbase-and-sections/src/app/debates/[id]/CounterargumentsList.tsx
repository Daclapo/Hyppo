'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import CounterargumentOverlay from './CounterargumentOverlay';
import { Button } from '@/components/ui/button';

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

interface CounterargumentsListProps {
  inFavorArguments: Argument[];
  againstArguments: Argument[];
  session: Session | null;
}

export default function CounterargumentsList({ inFavorArguments, againstArguments, session }: CounterargumentsListProps) {
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
  }, [inFavorArguments, againstArguments]);

  // Función para cargar el recuento de contraargumentos para cada argumento
  const loadCounterargumentsCounts = async (args: Argument[]) => {
    for (const argument of args) {
      try {        const { data, error } = await supabase.rpc(
          'count_debate_counterarguments',
          { argument_id: argument.id }
        );

        if (!error && data !== null) {
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

  const handleArgumentClick = (argument: Argument) => {
    setSelectedArgument(argument);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    loadCounterargumentsCounts(argumentsList); // Actualizar recuentos al cerrar
  };

  // Método para renderizar un botón de respuesta por cada argumento
  const renderResponseButton = (argument: Argument) => {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleArgumentClick(argument)}
        className="mt-2"
      >
        {argument.counterarguments_count && argument.counterarguments_count > 0
          ? `Ver respuestas (${argument.counterarguments_count})`
          : 'Responder'}
      </Button>
    );
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
