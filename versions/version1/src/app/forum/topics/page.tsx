import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import TopicList from '../../../components/forum/TopicList';

interface Topic {
  id: string;
  title: string;
  description: string;
  // Otros campos que necesites
}

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*');

      if (error) {
        console.error('Error fetching topics:', error);
      } else {
        setTopics(data as Topic[]);
      }
      setLoading(false);
    };

    fetchTopics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Temas de Discusión</h1>
      <p className="mb-4">Explora los diferentes temas de discusión del foro.</p>
      <TopicList topics={topics} />
    </div>
  );
}
