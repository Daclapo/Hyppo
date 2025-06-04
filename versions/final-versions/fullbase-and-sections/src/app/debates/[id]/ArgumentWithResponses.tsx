'use client';

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import CounterargumentOverlay from './CounterargumentOverlay';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare } from 'lucide-react';

// Función para calcular el tiempo relativo
function getRelativeTime(date: string): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}m`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y`;
}

interface Argument {
  id: string;
  content: string;
  is_in_favor: boolean;
  intensity: number;
  created_at: string;
  profiles: {
    username: string;
  } | null;
}

interface ArgumentWithResponsesProps {
  argument: Argument;
  session: Session | null;
}

export default function ArgumentWithResponses({ argument, session }: ArgumentWithResponsesProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [counterargsCount, setCounterargsCount] = useState(0);
  const supabase = createClient();

  // Función para calcular el tiempo relativo
  const getRelativeTime = (date: string): string => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}d`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}m`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y`;
  };

  useEffect(() => {
    fetchCounterargumentsCount();
  }, []);

  const fetchCounterargumentsCount = async () => {
    try {
      const { data, error } = await supabase.rpc('count_debate_counterarguments', {
        argument_id: argument.id
      });

      if (error) throw error;
      setCounterargsCount(data || 0);
    } catch (error) {
      console.error('Error al obtener contador de respuestas:', error);
    }
  };

  const handleResponseClick = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    // Actualizar el contador después de cerrar el overlay (por si se añadieron nuevas respuestas)
    fetchCounterargumentsCount();
  };
  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <MarkdownRenderer content={argument.content} />
      </div>      <div className="mt-2 flex justify-between items-center text-sm text-muted-foreground">
        <span className="flex items-center">
          Por {argument.profiles?.username} · {getRelativeTime(argument.created_at)}
          <MessageSquare className="w-4 h-4 ml-2 mr-1" />
          {counterargsCount}
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
      <div className="mt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleResponseClick}
        >
          Responder
        </Button>
      </div>

      {isOverlayOpen && (
        <CounterargumentOverlay
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          argument={argument}
          session={session}
        />
      )}
    </div>
  );
}
