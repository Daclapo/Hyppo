import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import DebateArgumentsClient from './DebateArgumentsClient';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ArgumentWithResponses from './ArgumentWithResponses';

export default async function DebateDetailPage({ params }: { params: { id: string } }) {
  // Esperar a que los parámetros estén disponibles
  const resolvedParams = await params;
  const id = resolvedParams.id;
  // Crear el cliente de Supabase y esperar a que se resuelva
  const supabase = await createClient();
  // Verificar si el usuario está autenticado de manera segura
  const { data: userData } = await supabase.auth.getUser();
  // Crear un objeto session compatible para los componentes existentes
  const session = userData.user ? { user: userData.user } : null;
    // Obtener la pregunta de debate
  const { data: debate, error: debateError } = await supabase
    .from('debate_questions')
    .select(`
      *,
      profiles:user_id (username)
    `)
    .eq('id', id)
    .single();
  
  if (debateError || !debate) {
    console.error('Error al cargar la pregunta de debate:', debateError);
    notFound();
  }
    // Obtener argumentos a favor
  const { data: inFavorArguments, error: inFavorError } = await supabase
    .from('debate_arguments')
    .select(`
      *,
      profiles:user_id (username)
    `)
    .eq('question_id', id)
    .eq('is_in_favor', true)
    .order('created_at', { ascending: false });
  
  if (inFavorError) {
    console.error('Error al cargar argumentos a favor:', inFavorError);
  }
    // Obtener argumentos en contra
  const { data: againstArguments, error: againstError } = await supabase
    .from('debate_arguments')
    .select(`
      *,
      profiles:user_id (username)
    `)
    .eq('question_id', id)
    .eq('is_in_favor', false)
    .order('created_at', { ascending: false });
  
  if (againstError) {
    console.error('Error al cargar argumentos en contra:', againstError);
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">¿{debate.title}?</h1>
      <div className="text-center text-sm text-muted-foreground mb-8">
        Preguntado por {debate.profiles?.username} · {new Date(debate.created_at).toLocaleDateString()}
      </div>
      
      {/* Contenido del debate (colapsable) */}
      {debate.content && (
        <details className="mb-10 bg-card rounded-lg p-4 shadow-md">
          <summary className="text-lg font-medium cursor-pointer">
            Ver contexto y descripción de la pregunta
          </summary>
          <div className="mt-4 whitespace-pre-wrap">
            {debate.content}
          </div>
        </details>
      )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Columna de argumentos a favor */}
        <div className="border-r-0 md:border-r border-gray-300 dark:border-gray-700 pr-0 md:pr-4">
          <h2 className="text-xl font-semibold mb-6 text-green-600 text-center">Argumentos a favor</h2>
          <div className="max-h-[600px] overflow-y-auto pr-2">            {inFavorArguments && inFavorArguments.length > 0 ? (
              <div className="space-y-6">
                {inFavorArguments.map((argument) => (
                  <ArgumentWithResponses 
                    key={argument.id}
                    argument={argument}
                    session={session}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No hay argumentos a favor aún.</p>
            )}
          </div>
        </div>
        
        {/* Columna de argumentos en contra */}
        <div className="pl-0 md:pl-4">
          <h2 className="text-xl font-semibold mb-6 text-red-600 text-center">Argumentos en contra</h2>
          <div className="max-h-[600px] overflow-y-auto pr-2">            {againstArguments && againstArguments.length > 0 ? (
              <div className="space-y-6">
                {againstArguments.map((argument) => (
                  <ArgumentWithResponses 
                    key={argument.id}
                    argument={argument}
                    session={session}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No hay argumentos en contra aún.</p>
            )}
          </div>
        </div>
      </div>
        {/* Formulario para añadir argumentos */}      <div className="mt-12">        <DebateArgumentsClient 
          questionId={id} 
          session={session} 
        />
      </div>
    </div>
  );
}
