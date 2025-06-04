import DocumentClient from "../DocumentClient"

export const metadata = {
  title: "Códigos lógicos | Hyppo",
  description: "Principios de razonamiento para discusiones efectivas en Hyppo",
}

const contenido = `
# Códigos lógicos

## Introducción

Los códigos lógicos son principios y métodos de razonamiento que nos ayudan a estructurar argumentos sólidos y a evaluar críticamente las afirmaciones. En Hyppo, consideramos que estos códigos son herramientas fundamentales para mantener discusiones productivas y orientadas hacia la verdad.

## Principios básicos de lógica

### Principio de no contradicción

Una proposición no puede ser verdadera y falsa al mismo tiempo y en el mismo sentido. Este principio es la base de la coherencia en nuestros razonamientos.

**Ejemplo**: No podemos sostener simultáneamente que "todos los seres humanos tienen derechos inherentes" y que "algunos seres humanos no tienen derechos inherentes".

### Principio del tercero excluido

Una proposición es verdadera o falsa, sin una tercera posibilidad (cuando hablamos de proposiciones claramente definidas).

**Ejemplo**: "Este número es par" - o es verdadero o es falso, no hay una tercera opción.

### Principio de identidad

Una entidad es idéntica a sí misma. Parece obvio, pero es crucial para mantener la consistencia en nuestros razonamientos.

**Ejemplo**: Si definimos "democracia" de cierta manera, debemos mantener esa definición a lo largo de todo nuestro argumento.

## Métodos de razonamiento

### Deducción

Partir de premisas generales para llegar a conclusiones particulares. Si las premisas son verdaderas y el razonamiento es válido, la conclusión es necesariamente verdadera.

**Estructura**:
- Todos los A son B
- C es A
- Por lo tanto, C es B

**Ejemplo**:
- Todos los planetas orbitan alrededor de una estrella
- La Tierra es un planeta
- Por lo tanto, la Tierra orbita alrededor de una estrella

### Inducción

Partir de observaciones particulares para inferir principios generales. Las conclusiones inductivas son probables, no ciertas.

**Estructura**:
- Se ha observado que A1, A2, A3... An son B
- Por lo tanto, probablemente todos los A son B

**Ejemplo**:
- Todos los cuervos observados hasta ahora son negros
- Por lo tanto, probablemente todos los cuervos son negros

### Abducción

Buscar la mejor explicación para un conjunto de hechos. Es un razonamiento hacia la hipótesis más plausible.

**Estructura**:
- Se observa el hecho sorprendente C
- Si A fuera verdadero, C sería una consecuencia natural
- No hay otra hipótesis que explique C mejor que A
- Por lo tanto, hay razones para sospechar que A es verdadero

**Ejemplo**:
- El suelo está mojado esta mañana (C)
- Si llovió anoche (A), el suelo estaría mojado
- No hay otra explicación más plausible para que el suelo esté mojado
- Por lo tanto, probablemente llovió anoche

## Aplicación en Hyppo

En las discusiones en Hyppo, te animamos a:

1. **Identificar claramente tus premisas**: ¿De qué suposiciones partes?
2. **Explicitar tu método de razonamiento**: ¿Estás deduciendo, induciendo o proponiendo la mejor explicación?
3. **Evaluar la fuerza de tus conclusiones**: ¿Son necesarias, probables o meramente posibles?
4. **Reconocer los límites de tu razonamiento**: ¿Qué podría invalidar tu argumento?

## Conclusión

Los códigos lógicos no son reglas arbitrarias sino herramientas que nos ayudan a razonar con mayor claridad y rigor. Al familiarizarnos con estos principios y métodos, mejoramos nuestra capacidad para construir argumentos sólidos y para evaluar críticamente las afirmaciones de otros.

Recuerda que el objetivo no es "ganar" discusiones sino acercarnos colectivamente a una mejor comprensión de los temas que exploramos.
`

export default function CodigosLogicos() {
  return <DocumentClient content={contenido} />
}
