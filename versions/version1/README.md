# Next.js Forum App

Este es un proyecto de aplicación web de foro construido con Next.js y React, que utiliza Supabase para manejar la autenticación de usuarios y la gestión de contenido.

## Características

- **Autenticación de Usuarios**: Los usuarios pueden registrarse e iniciar sesión en la aplicación.
- **Publicación de Contenido**: Los usuarios pueden crear y publicar contenido en diferentes salas de debate.
- **Salas de Debate**: La aplicación permite a los usuarios unirse a diferentes salas de debate según sus intereses.
- **Temas de Discusión**: Los usuarios pueden explorar y participar en discusiones sobre diversos temas.

## Estructura del Proyecto

```
nextjs-forum-app
├── src
│   ├── app
│   │   ├── (auth)                # Manejo de autenticación
│   │   │   ├── login              # Página de inicio de sesión
│   │   │   └── signup             # Página de registro
│   │   ├── (forum)                # Manejo de foros
│   │   │   ├── rooms              # Salas de debate
│   │   │   └── topics             # Temas de discusión
│   │   ├── api                    # Rutas de la API
│   │   ├── layout.tsx             # Diseño general de la aplicación
│   │   └── page.tsx               # Página de inicio
│   ├── components                  # Componentes reutilizables
│   ├── lib                        # Librerías y utilidades
│   ├── hooks                      # Hooks personalizados
│   ├── types                      # Tipos e interfaces
│   └── styles                     # Estilos globales
├── public                          # Activos públicos
├── middleware.ts                   # Lógica de middleware
├── next.config.js                 # Configuración de Next.js
├── package.json                   # Configuración de npm
├── tsconfig.json                  # Configuración de TypeScript
└── README.md                      # Documentación del proyecto
```

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   cd nextjs-forum-app
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura Supabase:
   - Crea un proyecto en [Supabase](https://supabase.io).
   - Obtén la URL y la clave de la API y configúralas en tu entorno.

4. Ejecuta la aplicación:
   ```
   npm run dev
   ```

5. Abre tu navegador y visita `http://localhost:3000`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.