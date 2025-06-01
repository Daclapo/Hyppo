// Necesitamos actualizar el archivo Tailwind para soportar modo claro y oscuro
const config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores para modo oscuro (existentes)
        // Añadimos variables CSS para poder cambiar dinámicamente
        background: {
          DEFAULT: 'var(--background)',
          secondary: 'var(--background-secondary)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          secondary: 'var(--foreground-secondary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
