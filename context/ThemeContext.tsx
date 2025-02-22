'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextType = {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string | null>(null) // Start with `null` to avoid SSR issues

  useEffect(() => {
    // Ensure this runs only on the client
    const storedTheme = localStorage.getItem('theme')
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'

    setTheme(storedTheme || systemTheme)
  }, [])

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme) // Persist theme
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme: theme || 'light', setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
