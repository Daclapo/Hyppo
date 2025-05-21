const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Fuente para el cuerpo del texto (por defecto si se usa font-sans)
        sans: ['var(--font-lato)', ...defaultTheme.fontFamily.sans],
        // Fuente específica para títulos (se usará con una clase como font-montserrat)
        montserrat: ['var(--font-montserrat)', ...defaultTheme.fontFamily.sans],
        // Podemos mantener Lato también como una opción explícita si es necesario
        lato: ['var(--font-lato)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        forum: {
          background: '#f9fafb',
          card: '#ffffff',
          highlight: '#ede9fe',
          border: '#e5e7eb',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            // Asegurarse de que la tipografía base también use la fuente Lato
            fontFamily: theme('fontFamily.lato').join(', '),
            h1: { fontFamily: theme('fontFamily.montserrat').join(', ') },
            h2: { fontFamily: theme('fontFamily.montserrat').join(', ') },
            h3: { fontFamily: theme('fontFamily.montserrat').join(', ') },
            h4: { fontFamily: theme('fontFamily.montserrat').join(', ') },
            h5: { fontFamily: theme('fontFamily.montserrat').join(', ') },
            h6: { fontFamily: theme('fontFamily.montserrat').join(', ') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
};
