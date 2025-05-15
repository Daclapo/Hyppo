'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import RoomCard from '../../../components/forum/RoomCard';
import { Room } from '../../../types';

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('*, topics(count), posts(count)');

        if (error) {
          console.error('Error fetching rooms:', error);
          throw error;
        }

        const roomsWithCounts = data?.map(room => ({
          ...room,
          topics_count: room.topics?.[0]?.count || 0,
          posts_count: room.posts?.[0]?.count || 0
        })) || [];

        setRooms(roomsWithCounts);
      } catch (error) {
        console.error('Error:', error);
        // Si ocurre un error, usamos datos de demostración
        setRooms([
          { id: '1', name: 'Filosofía', description: 'Discusión sobre filosofía.', topics_count: 5, posts_count: 23, created_at: new Date().toISOString() },
          { id: '2', name: 'Psicología', description: 'Discusión sobre psicología.', topics_count: 3, posts_count: 18, created_at: new Date().toISOString() },
          { id: '3', name: 'Biología', description: 'Discusión sobre biología.', topics_count: 7, posts_count: 42, created_at: new Date().toISOString() },
          { id: '4', name: 'Social', description: 'Discusión sobre temas sociales.', topics_count: 9, posts_count: 56, created_at: new Date().toISOString() },
          { id: '5', name: 'Historia', description: 'Discusión sobre historia.', topics_count: 4, posts_count: 31, created_at: new Date().toISOString() },
          { id: '6', name: 'Datos', description: 'Discusión sobre datos.', topics_count: 2, posts_count: 12, created_at: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">Salas de Discusión</h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
