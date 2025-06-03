"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, User, Moon, Sun, ChevronDown } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface UserMenuProps {
  username: string
  onLogout: () => void
}

export default function UserMenu({ username, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  // Manejar clics fuera del menú para cerrarlo
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div className="relative" ref={menuRef}>      <button
        className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{username}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
          <Link
            href={`/profile/${username}`}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-2" />
            Ver perfil
          </Link>          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Modo claro
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Modo oscuro
              </>
            )}
          </button>          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
