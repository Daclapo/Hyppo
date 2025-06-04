"use client"

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/button';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxHeight?: string;
  minHeight?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Escribe tu contenido usando Markdown...",
  maxHeight = "500px",
  minHeight = "300px"
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [previewContent, setPreviewContent] = useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Optimizar el rendimiento de la vista previa con contenido extenso
  useEffect(() => {
    // Limitar el contenido para la vista previa si es muy extenso
    if (showPreview) {
      if (value.length > 10000) {
        // Para textos muy largos, mostrar solo los primeros 10000 caracteres en la vista previa
        setPreviewContent(value.substring(0, 10000) + "\n\n[... Contenido truncado en la vista previa. El contenido completo se guardará ...]");
      } else {
        setPreviewContent(value);
      }
    }
  }, [value, showPreview]);

  // Actualiza la altura del textarea en función del contenido
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        parseInt(maxHeight),
        Math.max(parseInt(minHeight), textareaRef.current.scrollHeight)
      )}px`;
    }
  }, [value, maxHeight, minHeight]);

  // Función para insertar texto formateado en la posición del cursor
  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = value.substring(selectionStart, selectionEnd);

    const newText =
      value.substring(0, selectionStart) +
      before +
      selectedText +
      after +
      value.substring(selectionEnd);

    onChange(newText);

    // Calcular la nueva posición del cursor
    const newCursorPos = selectionStart + before.length + selectedText.length + after.length;
    setCursorPos(newCursorPos);

    // Focus y selección después de renderizar
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          selectionStart + before.length,
          selectionEnd + before.length
        );
      }
    }, 0);
  };

  // Funciones para los diferentes formatos de Markdown
  const addHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertText(prefix);
  };

  const addBold = () => insertText('**', '**');
  const addItalic = () => insertText('*', '*');
  const addBlockquote = () => insertText('> ');
  const addBulletList = () => insertText('- ');
  const addNumberedList = () => insertText('1. ');
  const addLink = () => insertText('[', '](url)');
  const addImage = () => insertText('![alt text](', ')');
  const addCode = () => insertText('`', '`');
  const addCodeBlock = () => insertText('```\n', '\n```');

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-1 overflow-x-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={() => addHeading(1)}
          >
            H1
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={() => addHeading(2)}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={addBold}
          >
            B
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={addItalic}
          >
            I
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={addBulletList}
          >
            • Lista
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={addNumberedList}
          >
            1. Lista
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={addLink}
          >
            Link
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={addImage}
          >
            Imagen
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={addCodeBlock}
          >
            Código
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:bg-gray-700"
            onClick={addBlockquote}
          >
            Cita
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:bg-gray-700 whitespace-nowrap"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Editar" : "Vista previa"}
        </Button>
      </div>

      {/* Editor / Preview */}
      <div className="relative">
        {/* Editor */}
        {!showPreview && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 bg-gray-900 text-white resize-none outline-none"
            style={{
              minHeight: minHeight,
              maxHeight: maxHeight,
              overflowY: 'auto'
            }}
          />
        )}

        {/* Vista previa */}
        {showPreview && (
          <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none p-4 overflow-auto"
            style={{
              minHeight: minHeight,
              maxHeight: maxHeight
            }}
          >
            {value ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: ({node, ...props}) => <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />,
                  h1: ({node, ...props}) => <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />,
                  h2: ({node, ...props}) => <h2 {...props} className="text-xl font-bold mt-5 mb-3" />,
                  h3: ({node, ...props}) => <h3 {...props} className="text-lg font-bold mt-4 mb-2" />,
                  p: ({node, ...props}) => <p {...props} className="mb-4" />,
                  ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 mb-4" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mb-4" />,
                  li: ({node, ...props}) => <li {...props} className="mb-1" />,
                  blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-gray-600 pl-4 italic my-4" />,
                }}
              >
                {previewContent}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">No hay contenido para previsualizar</p>
            )}
          </div>
        )}
      </div>

      {/* Guía de Markdown */}
      <div className="border-t border-gray-700 p-2 bg-gray-800">
        <details className="text-xs text-gray-400">
          <summary className="cursor-pointer hover:text-gray-300">Guía rápida de Markdown</summary>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 p-2">
            <div>
              <code># Título</code> - Título grande
            </div>
            <div>
              <code>**texto**</code> - Texto en negrita
            </div>
            <div>
              <code>*texto*</code> - Texto en cursiva
            </div>
            <div>
              <code>[link](url)</code> - Enlace
            </div>
            <div>
              <code>![alt](url)</code> - Imagen
            </div>
            <div>
              <code>- item</code> - Lista con viñetas
            </div>
            <div>
              <code>1. item</code> - Lista numerada
            </div>
            <div>
              <code>{'>'} texto</code> - Cita
            </div>
            <div>
              <code>\`código\`</code> - Código inline
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
