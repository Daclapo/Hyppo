import BibliotecaClient from "./BibliotecaClient"

export const metadata = {
  title: "Biblioteca | Hyppo",
  description: "Documentación y recursos sobre el pensamiento crítico en Hyppo",
}

const documentosDelaBiblioteca = [
  {
    id: "guia-nuevos-usuarios",
    title: "Guía de nuevos usuarios",
    description: "Introducción a la plataforma para usuarios que recién se unen a Hyppo."
  },
  {
    id: "valores-principios",
    title: "Valores y principios de la plataforma",
    description: "Los fundamentos filosóficos y éticos que guían nuestra comunidad."
  },
  {
    id: "conductas-deseadas",
    title: "Conductas deseadas",
    description: "Comportamientos que fomentan un diálogo constructivo y respetuoso."
  },
  {
    id: "codigos-logicos",
    title: "Códigos lógicos",
    description: "Principios de razonamiento y argumentación para discusiones efectivas."
  },
  {
    id: "falacias-logicas",
    title: "Falacias lógicas comunes",
    description: "Errores de razonamiento que debemos evitar en nuestras discusiones."
  },
  {
    id: "tolerancia",
    title: "Tolerancia",
    description: "Cómo practicar y promover la tolerancia en nuestros debates y conversaciones."
  },
]

export default function BibliotecaPage() {
  return <BibliotecaClient documentos={documentosDelaBiblioteca} />
}
