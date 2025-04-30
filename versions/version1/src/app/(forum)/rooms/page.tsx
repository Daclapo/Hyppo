import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import RoomCard from '../../../components/forum/RoomCard';

interface Room {
  id: string;
  name: string;
  description: string;
  // Otros campos que necesites
}

const rooms: Room[] = [
  { id: '1', name: 'Filosofía', description: 'Discusión sobre filosofía.' },
  { id: '2', name: 'Psicología', description: 'Discusión sobre psicología.' },
  { id: '3', name: 'Biología', description: 'Discusión sobre biología.' },
  { id: '4', name: 'Social', description: 'Discusión sobre temas sociales.' },
  { id: '5', name: 'Historia', description: 'Discusión sobre historia.' },
  { id: '6', name: 'Datos', description: 'Discusión sobre datos.' },
];

export default function Rooms() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Salas de Discusión</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
