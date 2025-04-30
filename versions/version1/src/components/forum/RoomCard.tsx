import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

interface Room {
  id: string;
  name: string;
  description: string;
  // Otros campos que necesites
}

interface Message {
  id: string;
  content: string;
  // Otros campos que necesites
}

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ room_id: room.id, content: message }]);

    if (error) {
      console.error('Error al enviar el mensaje:', error);
    } else if (data) {
      setMessages([...messages, data[0] as Message]);
      setMessage('');
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-md">
      <h2 className="text-xl font-bold mb-2">{room.name}</h2>
      <p className="text-gray-600 mb-4">{room.description}</p>
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="border p-2 w-full"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 mt-2">
          Enviar
        </button>
      </div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id} className="border-b py-2">
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomCard;
