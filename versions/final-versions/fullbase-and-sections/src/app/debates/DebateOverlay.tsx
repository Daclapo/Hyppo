'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DebateOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  debate: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
    } | null;
  };
}

export default function DebateOverlay({ isOpen, onClose, debate }: DebateOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">¿{debate.title}?</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Preguntado por {debate.profiles?.username} · {new Date(debate.created_at).toLocaleDateString()}
          </div>

          <div className="mt-6 mb-8 whitespace-pre-wrap">
            {debate.content}
          </div>

          <div className="flex justify-center mt-8">
            <Link href={`/debates/${debate.id}`}>
              <Button>Ver argumentos del debate</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
