import DocumentClient from "../DocumentClient"

export const metadata = {
  title: "Guía de nuevos usuarios | Hyppo",
  description: "Guía de introducción a la plataforma Hyppo para nuevos usuarios",
}

const contenido = `
# Guía para nuevos usuarios

## ¡Bienvenido a Hyppo!

Hyppo es una plataforma diseñada para fomentar el pensamiento crítico, el debate constructivo y el intercambio riguroso de ideas. A diferencia de otras redes sociales, aquí nos enfocamos en la calidad de las conversaciones y en el desarrollo de argumentos bien fundamentados.

## ¿Cómo empezar?

### 1. Completa tu perfil

Lo primero que deberías hacer es completar tu perfil añadiendo una breve biografía. Esto ayuda a otros usuarios a conocerte y entender tu perspectiva.

### 2. Explora la plataforma

Hyppo tiene varios apartados que puedes explorar:

- **Inicio**: Publicaciones recientes y recomendadas
- **Todo**: Un listado cronológico de todas las publicaciones
- **Etiquetas**: Navega por contenido clasificado por temáticas
- **Debates**: Participa en discusiones estructuradas con argumentos a favor y en contra
- **Semanal**: Reflexiones sobre temas propuestos cada semana
- **Biblioteca**: Documentos sobre pensamiento crítico y buenas prácticas (¡estás aquí!)

### 3. Crea tu primera publicación

Para crear una publicación:

1. Haz clic en "Crear Publicación" en el menú lateral
2. Escribe un título claro y descriptivo
3. Redacta tu contenido utilizando formato Markdown
4. Añade etiquetas relevantes (máximo 4)
5. Publica tu contenido

### 4. Participa constructivamente

Al comentar en publicaciones de otros usuarios o participar en debates, recuerda:

- Enfócate en los argumentos, no en las personas
- Fundamenta tus afirmaciones con evidencias
- Mantén un tono respetuoso y constructivo
- Está abierto a cambiar de opinión si se presentan mejores argumentos

## Principios de Hyppo

En Hyppo valoramos:

- **Rigor intelectual**: Las afirmaciones deben estar respaldadas por evidencias y razonamientos sólidos.
- **Honestidad**: Reconocemos nuestras limitaciones y estamos dispuestos a corregir errores.
- **Respeto**: Tratamos a todos los participantes con dignidad, independientemente de sus opiniones.
- **Curiosidad**: Estamos abiertos a explorar nuevas ideas y perspectivas.
- **Claridad**: Nos esforzamos por comunicar nuestras ideas de manera precisa y comprensible.

## Formato de escritura

Hyppo utiliza **Markdown** para dar formato a tus publicaciones. Algunos ejemplos básicos:

\`\`\`
# Título principal
## Subtítulo
**Texto en negrita**
*Texto en cursiva*
[Enlace](https://ejemplo.com)
> Cita de texto
\`\`\`

## ¿Necesitas ayuda?

Si tienes alguna duda o sugerencia, puedes:

- Consultar otros documentos en la Biblioteca
- Enviar tus comentarios a través del apartado "Sugerencias"

¡Esperamos que disfrutes de tu experiencia en Hyppo y contribuyas a crear un espacio de diálogo enriquecedor!
`

export default function GuiaNuevosUsuarios() {
  return <DocumentClient content={contenido} />
}
