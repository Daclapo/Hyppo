"use client"

import MarkdownRenderer from "@/components/MarkdownRenderer"

interface DocumentClientProps {
  content: string;
}

export default function DocumentClient({ content }: DocumentClientProps) {
  return (
    <div className="py-6">
      <div className="prose prose-invert max-w-none">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  )
}
