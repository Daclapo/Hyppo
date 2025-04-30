import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../../lib/supabase/client';
import PostForm from '../../../../components/forum/PostForm';
import PostCard from '../../../../components/forum/PostCard';

interface Post {
  id: string;
  content: string;
  // Otros campos que necesites
}

const TopicPage = () => {
  const router = useRouter();
  const { topicId } = router.query;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!topicId) return;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('topic_id', topicId);

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data as Post[]);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [topicId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Topic: {topicId}</h1>
      <PostForm topicId={topicId as string} />
      <div>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default TopicPage;
