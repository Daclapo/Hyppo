"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Intentar recuperar el tema del localStorage (solo en el cliente)
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  // Solo ejecutar en el cliente para evitar errores de hidratación
  useEffect(() => {
    setMounted(true)
    // Siempre establecer el tema a oscuro
    setTheme('dark')
  }, [])
  useEffect(() => {
    if (mounted) {
      // Siempre aplicar la clase 'dark' al elemento html
      const htmlElement = document.documentElement
      htmlElement.classList.add('dark')
      htmlElement.classList.remove('light')
    }
  }, [mounted])
  const toggleTheme = () => {
    // No hacer nada, pero mantener la función para la interfaz
    console.log('Función de cambio de tema desactivada')
  }

  // No renderizar nada hasta que estemos montados para evitar hidratación incorrecta
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
