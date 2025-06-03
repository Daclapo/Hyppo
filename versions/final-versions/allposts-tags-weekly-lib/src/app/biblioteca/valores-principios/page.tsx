import DocumentClient from "../DocumentClient"

export const metadata = {
  title: "Valores y principios | Hyppo",
  description: "Los valores y principios fundamentales que guían la plataforma Hyppo",
}

const contenido = `
# Valores y principios de la plataforma

## Nuestra visión

Hyppo nace con la visión de crear un espacio digital donde las ideas puedan ser compartidas, debatidas y refinadas con rigor intelectual y respeto mutuo. Nos inspiramos en conceptos como las "Penny Universities" del siglo XVII, donde personas de diferentes orígenes se reunían para intercambiar conocimientos mientras tomaban café por un penique, y en las ideas de Jürgen Habermas sobre la esfera pública deliberativa.

En un mundo digital cada vez más polarizado, donde los algoritmos suelen favorecer el contenido divisivo y las cámaras de eco refuerzan nuestros sesgos, Hyppo aspira a ser un contrapunto: un lugar donde prevalezca la búsqueda conjunta de la verdad sobre la victoria retórica.

## Principios fundamentales

### 1. Pensamiento crítico

Promovemos el análisis riguroso de las ideas, la evaluación de evidencias y argumentos, y la disposición a cuestionar tanto nuestras propias creencias como las ajenas. El pensamiento crítico implica:

- Examinar los fundamentos de las afirmaciones
- Identificar sesgos y falacias lógicas
- Considerar perspectivas alternativas
- Mantener una mente abierta pero escéptica

### 2. Buena fe argumentativa

Las discusiones en Hyppo se basan en la presunción de que todos los participantes buscan sinceramente entender y hacerse entender. Esto implica:

- Representar fielmente las posiciones ajenas
- No distorsionar intencionalmente los argumentos de otros
- Reconocer los puntos válidos de quienes piensan diferente
- Estar dispuesto a cambiar de opinión ante mejores argumentos

### 3. Evidencia y razonamiento

Valoramos las afirmaciones respaldadas por evidencias verificables y razonamientos lógicos sólidos. Esto no significa que solo aceptemos el conocimiento científico formal, pero sí que:

- Las afirmaciones extraordinarias requieren evidencias extraordinarias
- Los argumentos deben seguir reglas básicas de lógica
- Las fuentes de información deben ser citadas y evaluadas críticamente
- Reconocemos los límites de nuestro conocimiento

### 4. Diversidad cognitiva

La "sabiduría de la multitud" emerge cuando personas con diferentes perspectivas, experiencias y marcos conceptuales colaboran en la resolución de problemas. Por ello:

- Valoramos la pluralidad de puntos de vista
- Reconocemos que la diversidad epistémica enriquece nuestras discusiones
- Evitamos la homogeneidad de pensamiento y las cámaras de eco
- Buscamos activamente perspectivas que desafíen el consenso

### 5. Respeto y dignidad

El intercambio de ideas solo puede prosperar en un ambiente de respeto mutuo, donde se critique las ideas sin atacar a las personas. Esto significa:

- Tratar a todos los participantes con cortesía
- Separar las ideas de quienes las sostienen
- Rechazar el lenguaje despectivo o deshumanizante
- Reconocer la dignidad inherente de cada participante

### 6. Mejora continua

Tanto las ideas como nuestra comprensión de ellas son perfectibles. Valoramos:

- La disposición a revisar y refinar nuestros argumentos
- La capacidad de admitir errores y limitaciones
- El aprendizaje colectivo y acumulativo
- La búsqueda de síntesis entre perspectivas aparentemente opuestas

## Compromiso con estos valores

Estos valores no son meras declaraciones abstractas, sino principios que guían el diseño de nuestra plataforma, nuestras políticas de moderación y las normas comunitarias. Invitamos a todos los participantes a hacerlos suyos, recordando que su aplicación siempre será imperfecta y estará sujeta a debate.

Al participar en Hyppo, te comprometes a esforzarte por mantener estos principios, sabiendo que todos fallamos ocasionalmente, pero que el compromiso compartido con estos ideales nos ayuda a crear un espacio de deliberación cada vez mejor.
`

export default function ValoresPrincipios() {
  return <DocumentClient content={contenido} />
}
