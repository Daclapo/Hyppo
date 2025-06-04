"use client"

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Componente para mostrar contenido en formato Markdown con características adicionales:
 * - Soporte para GFM (GitHub Flavored Markdown)
 * - Resaltado de sintaxis en bloques de código
 * - Soporte para HTML en línea
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) {
    return <div className="text-gray-400">No hay contenido disponible</div>;
  }
  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none whitespace-pre-wrap">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
