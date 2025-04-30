import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase/client';
import RoomCard from '../../../components/forum/RoomCard';

interface Room {
  id: string;
  name: string;
  description: string;
  // Otros campos que necesites
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');

      if (error) {
        console.error('Error fetching rooms:', error);
      } else {
        setRooms(data as Room[]);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Salas de Discusión</h1>
      <p className="mb-4">Esta página mostrará las diferentes salas disponibles en el foro.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
