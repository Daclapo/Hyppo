"use client";

import React from 'react';
import { useState } from 'react';

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

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const formattedDate = new Date(post.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            {post.profiles?.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles?.username || "Usuario"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-indigo-600 font-medium">
                {post.profiles?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {post.profiles?.name || 'Usuario anónimo'}
            </p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Opciones de publicación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showOptions && (
            <div
              className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
              onMouseLeave={() => setShowOptions(false)}
            >
              <ul>
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-t-lg">
                    Reportar publicación
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-b-lg">
                    Compartir
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-indigo max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors text-sm"
          aria-label="Me gusta"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>Me gusta</span>
        </button>

        <button
          className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors text-sm"
          aria-label="Responder"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span>Responder</span>
        </button>
      </div>
    </div>
  );

export default PostCard;
