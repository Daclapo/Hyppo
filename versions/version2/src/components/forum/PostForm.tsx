"use client";

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    name: string;
    avatar_url?: string;
  };
}

interface PostFormProps {
  roomId?: string;
  topicId?: string;
  onSuccess?: (post: Post) => void;
}

const PostForm: React.FC<PostFormProps> = ({ roomId, topicId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!content.trim()) {
      setError('El contenido es obligatorio');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('Debes iniciar sesión para publicar');
      setLoading(false);
      return;
    }

    try {
      const newPost = {
        content: content.trim(),
        room_id: roomId,
        topic_id: topicId,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select(`
          *,
          profiles (*)
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setContent('');

      // Notificar al componente padre sobre el nuevo post
      if (onSuccess && data) {
        onSuccess(data as unknown as Post);
      }
    } catch (err: any) {
      setError(`Error al publicar: ${err.message}`);
      console.error('Error al crear post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Participa en la conversación</h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r">
          <p role="alert">{error}</p>
        </div>
      )}

      <div className="mb-4">
        {user ? (
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || "Usuario"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-indigo-600 font-medium">
                  {user.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              Publicando como {user.name || user.email}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-3">
            Inicia sesión para participar en este tema
          </p>
        )}

        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "Escribe tu respuesta aquí..." : "Inicia sesión para responder"}
          disabled={!user || loading}
          required
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading || !user}
        >
          {loading ? 'Publicando...' : 'Publicar respuesta'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
