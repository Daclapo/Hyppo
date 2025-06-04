'use client';

import { useState } from 'react';
import Link from 'next/link';
import DebateOverlay from './DebateOverlay';

interface Debate {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  } | null;
  in_favor_count: number;
  against_count: number;
}

interface DebatesListProps {
  debates: Debate[];
}

export default function DebatesList({ debates }: DebatesListProps) {
  const [selectedDebate, setSelectedDebate] = useState<Debate | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleDebateClick = (debate: Debate) => {
    setSelectedDebate(debate);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <>
      <div className="grid gap-6">
        {debates && debates.length > 0 ? (
          debates.map((debate) => (
            <div
              key={debate.id}
              className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleDebateClick(debate)}
            >
              <h2 className="text-xl font-semibold mb-3">¿{debate.title}?</h2>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Preguntado por {debate.profiles?.username} · {new Date(debate.created_at).toLocaleDateString()}
                </div>
                <div className="flex space-x-4">
                  <span className="text-green-600 font-medium flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                    {debate.in_favor_count} a favor
                  </span>
                  <span className="text-red-600 font-medium flex items-center">
                    <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                    {debate.against_count} en contra
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No hay preguntas de debate aún. ¡Sé el primero en crear una!</p>
          </div>
        )}
      </div>

      {selectedDebate && (
        <DebateOverlay
          isOpen={isOverlayOpen}
          onClose={closeOverlay}
          debate={selectedDebate}
        />
      )}
    </>
  );
}
