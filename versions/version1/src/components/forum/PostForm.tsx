import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

interface PostFormProps {
  roomId?: string;
  topicId?: string;
}

const PostForm: React.FC<PostFormProps> = ({ roomId, topicId }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!content) {
      setError('Content is required');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ content, room_id: roomId, topic_id: topicId }]);

    if (error) {
      setError(error.message);
    } else {
      setContent('');
      // Handle successful post creation (e.g., refresh the list of posts)
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default PostForm;
