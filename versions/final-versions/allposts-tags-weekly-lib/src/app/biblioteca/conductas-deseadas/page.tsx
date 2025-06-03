import DocumentClient from "../DocumentClient"

export const metadata = {
  title: "Conductas deseadas | Hyppo",
  description: "Comportamientos que fomentan un diálogo constructivo en Hyppo",
}

const contenido = `
# Conductas deseadas

## Introducción

En Hyppo, buscamos crear un espacio donde el intercambio de ideas sea riguroso, respetuoso y constructivo. Este documento describe las conductas que valoramos y promovemos en nuestra comunidad para mantener un ambiente propicio para el pensamiento crítico y el debate de calidad.

## Conductas que valoramos

### Integridad intelectual

* **Honestidad**: Sé veraz en tus afirmaciones y transparente sobre tus fuentes.
* **Reconocimiento de errores**: Admite cuando te equivocas y aprovecha estos momentos como oportunidades de aprendizaje.
* **Consistencia**: Aplica los mismos estándares de evidencia y razonamiento a todos los argumentos, incluyendo los tuyos.

### Comunicación constructiva

* **Claridad**: Expresa tus ideas de manera comprensible, definiendo términos ambiguos cuando sea necesario.
* **Relevancia**: Mantén tus contribuciones enfocadas en el tema de discusión.
* **Constructividad**: Orienta tus críticas hacia la mejora de ideas, no hacia la derrota o humillación de otros participantes.

### Respeto activo

* **Presunción de buena fe**: Asume que otros participantes tienen intenciones genuinas de contribuir positivamente.
* **Consideración de perspectivas diversas**: Valora y busca entender puntos de vista diferentes al tuyo.
* **Paciencia**: Reconoce que el entendimiento mutuo requiere tiempo y esfuerzo.

### Apertura al aprendizaje

* **Curiosidad**: Haz preguntas genuinas para profundizar tu comprensión.
* **Receptividad a la crítica**: Considera seriamente las objeciones a tus argumentos.
* **Crecimiento continuo**: Busca constantemente refinar tus ideas y mejorar tu capacidad de razonamiento.

## Beneficios de estas conductas

Cuando los miembros de nuestra comunidad practican estas conductas:

* Las discusiones se vuelven más productivas y esclarecedoras
* Se desarrolla la confianza mutua
* Emergen síntesis creativas entre diferentes perspectivas
* Todos los participantes tienen la oportunidad de ser escuchados y aprender

## Conclusión

Estas conductas no son reglas rígidas sino aspiraciones compartidas. Todos somos humanos y podemos fallar en mantener estos estándares en todo momento. Lo importante es el compromiso colectivo de esforzarnos por ejemplificar estas conductas y apoyarnos mutuamente en su desarrollo.

Al participar en Hyppo, te invitamos a reflexionar sobre estas conductas deseadas y a contribuir a una cultura de diálogo que nos permita acercarnos juntos a una mejor comprensión de los temas que exploramos.
`

export default function ConductasDeseadas() {
  return <DocumentClient content={contenido} />
}
