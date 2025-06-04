import { createClient } from '@/lib/supabase/server';
import DebatesClient from './DebatesClient';
import DebatesList from './DebatesList';

export default async function DebatesPage() {
  // Crear el cliente de Supabase y esperar a que se resuelva
  const supabase = await createClient();
  // Verificar si el usuario está autenticado de manera segura
  const { data: userData } = await supabase.auth.getUser();
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  // Obtener las preguntas de debate con conteo de argumentos
  const { data: debates, error } = await supabase
    .from('debate_questions')
    .select(`
      *,
      profiles:user_id (username)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al cargar preguntas de debate:', error);
  }  // Para cada pregunta, obtenemos el recuento de argumentos a favor y en contra
  const debatesWithCounts = await Promise.all((debates || []).map(async (debate) => {
    try {
      const { data: counts, error: countsError } = await supabase.rpc('count_debate_arguments', {
        question_id: debate.id
      });      if (countsError) {
        console.error('Error al contar argumentos para debate', debate.id, ':', countsError);
        return { ...debate, in_favor_count: 0, against_count: 0 };
      }

      // Para depuración: mostrar el formato exacto de los datos
      console.log('Formato de counts para debate', debate.id, ':', JSON.stringify(counts));

      // La función RPC devuelve un solo objeto (no un array) con in_favor_count y against_count
      let inFavorCount = 0;
      let againstCount = 0;

      if (counts) {
        if (Array.isArray(counts) && counts.length > 0) {
          inFavorCount = Number(counts[0].in_favor_count) || 0;
          againstCount = Number(counts[0].against_count) || 0;
        } else {
          inFavorCount = Number(counts.in_favor_count) || 0;
          againstCount = Number(counts.against_count) || 0;
        }
      }

      return {
        ...debate,
        in_favor_count: inFavorCount,
        against_count: againstCount
      };
    } catch (error) {
      console.error('Error general:', error);
      return { ...debate, in_favor_count: 0, against_count: 0 };
    }
  }));

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Debates</h1>
      <div className="mb-10">
        <DebatesClient session={session} />
      </div>

      <DebatesList debates={debatesWithCounts} />
    </div>
  );
}
