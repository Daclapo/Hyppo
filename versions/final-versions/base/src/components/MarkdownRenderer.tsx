"use client"

interface MarkdownRendererProps {
  content: string;
}

/**
 * Componente para mostrar contenido de texto
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) {
    return <div className="text-gray-400">No hay contenido disponible</div>;
  }

  // Por ahora usamos un simple formateador de texto
  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  );
}
