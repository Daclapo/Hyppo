"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BibliotecaClientProps {
  documentos: {
    id: string;
    title: string;
    description: string;
  }[];
}

export default function BibliotecaClient({ documentos }: BibliotecaClientProps) {
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Biblioteca</h1>
        <p className="text-gray-300 text-lg">
          Bienvenido a la Biblioteca de Hyppo, un repositorio de conocimiento sobre pensamiento crítico,
          lógica y buenas prácticas para el debate constructivo. Estos documentos son recursos estáticos
          que te ayudarán a entender mejor la plataforma y sus principios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {documentos.map((doc) => (
          <div
            key={doc.id}
            className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition-colors"
          >
            <h2 className="text-xl font-semibold text-white mb-2">{doc.title}</h2>
            <p className="text-gray-300 mb-4">{doc.description}</p>
            <Link href={`/biblioteca/${doc.id}`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Leer documento
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
