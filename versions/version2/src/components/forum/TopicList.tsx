"use client";

import React from 'react';
import Link from 'next/link';
import { Topic } from '../../types';

interface TopicListProps {
  topics: Topic[];
  loading?: boolean;
}

const TopicList: React.FC<TopicListProps> = ({ topics, loading = false }) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse border border-gray-100 p-5 rounded-2xl shadow-md bg-white flex flex-col h-full">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6 mb-4"></div>
            <div className="flex justify-between items-center mt-auto">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <p className="text-gray-500">No hay temas disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {topics.map(topic => (
        <Link
          href={`/topics/${topic.id}`}
          key={topic.id}
          className="group"
        >
          <div className="border border-gray-100 p-5 rounded-2xl shadow-md hover:shadow-lg bg-white flex flex-col h-full transition-all hover:border-indigo-200">
            <h2 className="text-lg font-bold mb-1 text-gray-800 group-hover:text-indigo-700 transition-colors">
              {topic.title || topic.name}
            </h2>
            <p className="text-gray-600 mb-3 flex-1 line-clamp-2">
              {topic.description}
            </p>

            {topic.profiles && (
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  {topic.profiles.avatar_url ? (
                    <img
                      src={topic.profiles.avatar_url}
                      alt={topic.profiles.name || "Usuario"}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-indigo-600">
                      {topic.profiles.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <span>{topic.profiles.name || 'Usuario anónimo'}</span>
                <span className="mx-1">•</span>
                <span>{new Date(topic.created_at).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
            )}

            <div className="flex justify-between items-center mt-auto">
              <span className="text-indigo-600 font-medium text-sm group-hover:underline">
                Ver discusión →
              </span>
              <div className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
                <span>{topic.posts_count || 0} {topic.posts_count === 1 ? 'respuesta' : 'respuestas'}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopicList;
