'use client';

import React from 'react';
import Link from 'next/link';
import { Room } from '../../types';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <div className="border border-gray-100 p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
      <h2 className="text-lg font-bold mb-1 text-indigo-700">{room.name}</h2>
      <p className="text-gray-600 mb-3 flex-1">{room.description}</p>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{room.topics_count || 0} temas</span>
        <span>{room.posts_count || 0} mensajes</span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href={`/rooms/${room.id}`}
          className="text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
        >
          Ver debates →
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
