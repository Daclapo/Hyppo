import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SugerenciasClient from './SugerenciasClient';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default async function SugerenciasPage() {
  // Crear el cliente de Supabase y esperar a que se resuelva
  const supabase = await createClient();
    // Verificar si el usuario está autenticado de manera segura
  const { data: userData } = await supabase.auth.getUser();
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  // Obtener las sugerencias
  const { data: suggestions, error } = await supabase
    .from('suggestions')
    .select(`
      *,
      profiles:user_id (username)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al cargar sugerencias:', error);
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Sugerencias</h1>

      <div className="mb-10">
        <SugerenciasClient session={session} />
      </div>

      <div className="space-y-6">
        {suggestions && suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <details key={suggestion.id} className="bg-card rounded-lg shadow-md group">
              <summary className="p-4 cursor-pointer list-none flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{suggestion.profiles?.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(suggestion.created_at).toLocaleDateString()}
                  </span>
                </div>
                <svg
                  className="w-5 h-5 transition-transform group-open:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </summary>              <div className="p-4 pt-0">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownRenderer content={suggestion.content} />
                </div>
              </div>
            </details>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No hay sugerencias aún. ¡Sé el primero en crear una!</p>
          </div>
        )}
      </div>
    </div>
  );
}
