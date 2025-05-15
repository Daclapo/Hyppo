# Foro Hippo - Aplicación de Foro con Next.js

## Descripción

Foro Hippo es una aplicación web moderna de foro de discusión desarrollada con Next.js 14, React y Supabase. Permite a los usuarios participar en debates sobre diversos temas organizados en categorías, salas y temas específicos. La plataforma ofrece un sistema completo de autenticación, gestión de contenido y una interfaz de usuario intuitiva y responsiva.

## Características Principales

- **Autenticación Completa**: Registro, inicio de sesión, y gestión de cuentas de usuario
- **Categorías Temáticas**: Organización de debates en categorías específicas
- **Salas de Discusión**: Salas especializadas dentro de cada categoría
- **Temas de Debate**: Hilos de discusión organizados por temas específicos
- **Interfaz Responsiva**: Diseño adaptado a dispositivos móviles y escritorio
- **Estado en Tiempo Real**: Actualización en tiempo real de contenidos y interacciones

## Tecnologías Utilizadas

- **Frontend**:
  - Next.js 14 (App Router)
  - React 18
  - Tailwind CSS
  - TypeScript

- **Backend**:
  - Supabase (Base de datos PostgreSQL)
  - Autenticación de Supabase
  - Almacenamiento de Supabase

- **Herramientas de Desarrollo**:
  - ESLint
  - Prettier
  - TypeScript

## Estructura del Proyecto

```
nextjs-forum-app
├── src
│   ├── app
│   │   ├── (auth)                 # Rutas de autenticación
│   │   │   ├── login              # Página de inicio de sesión
│   │   │   └── signup             # Página de registro
│   │   ├── (forum)                # Rutas del foro
│   │   │   ├── rooms              # Salas de debate
│   │   │   │   └── [roomId]       # Detalles de sala específica
│   │   │   └── topics             # Temas de discusión
│   │   │       └── [topicId]      # Detalles de tema específico
│   │   ├── api                    # API Routes
│   │   │   ├── auth               # Endpoints de autenticación
│   │   │   └── posts              # Endpoints de posts
│   │   ├── layout.tsx             # Layout principal
│   │   └── page.tsx               # Página de inicio
│   ├── components                 # Componentes reutilizables
│   │   ├── auth                   # Componentes de autenticación
│   │   ├── forum                  # Componentes del foro
│   │   ├── layout                 # Componentes de diseño
│   │   └── ui                     # Componentes de interfaz genéricos
│   ├── hooks                      # Custom Hooks
│   ├── lib
│   │   └── supabase               # Cliente y utilidades de Supabase
│   ├── types                      # Definiciones de TypeScript
│   └── middleware.ts              # Middleware (autenticación, etc.)
├── public                         # Archivos estáticos
├── scripts                        # Scripts de utilidad
└── supabase                       # Esquemas y scripts de Supabase
```

## Instalación y Configuración

### Requisitos Previos

- Node.js 18.0 o superior
- npm o yarn
- Cuenta en Supabase

### Pasos de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/nextjs-forum-app.git
   cd nextjs-forum-app
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   # o
   yarn
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` con las siguientes variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Configurar la base de datos**:
   Ejecuta los esquemas de SQL en tu proyecto de Supabase:
   ```bash
   npm run setup:db
   # o
   yarn setup:db
   ```

5. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila la aplicación para producción
- `npm start`: Inicia la versión compilada
- `npm run lint`: Ejecuta el linter
- `npm run setup:db`: Configura la base de datos con los esquemas iniciales
- `npm run update:categories`: Actualiza las categorías en la base de datos

## Estructura de la Base de Datos

El proyecto utiliza las siguientes tablas principales en Supabase:

- `users`: Perfiles de usuario
- `categories`: Categorías principales
- `rooms`: Salas de discusión
- `topics`: Temas específicos
- `posts`: Publicaciones y respuestas

## Buenas Prácticas y Consideraciones

- **Seguridad**: Utilizamos Middleware para proteger rutas que requieren autenticación
- **Rendimiento**: Implementamos Server Components y Client Components según corresponda
- **Accesibilidad**: Seguimos las mejores prácticas de a11y en componentes UI
- **SEO**: Metadatos optimizados para motores de búsqueda

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter) - email@ejemplo.com

Enlace del Proyecto: [https://github.com/tu-usuario/nextjs-forum-app](https://github.com/tu-usuario/nextjs-forum-app)

## Notas de configuración y mejoras recientes

- Tailwind CSS está correctamente instalado y configurado en el proyecto. Los estilos se aplican usando clases utilitarias en los componentes React.
- Se han añadido archivos de configuración para Prettier y Stylelint para mantener la consistencia de estilos de código y CSS.
- Se ha añadido configuración y dependencias para testing automatizado con Jest y Testing Library.
- Para ejecutar los tests: `npm test`
- Para formatear el código: `npx prettier --write .`
- Para revisar estilos CSS: `npx stylelint "src/**/*.css"`

## Mejoras pendientes

- Mejorar los mensajes de error en la autenticación para que sean más amigables.
- Revisar y mejorar la accesibilidad (a11y) en los componentes principales.
- Modernizar la paleta de colores, tipografía y animaciones para un diseño más atractivo.
