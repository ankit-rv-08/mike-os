'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type ThemeMode = 'Normal' | 'Focus' | 'Deadline' | 'Hacker'

interface ThemeContextType {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType>({ mode: 'Normal', setMode: () => {} })

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('Normal')

  useEffect(() => {
    const root = document.documentElement
    
    // --- 1. NORMAL MODE (From Image 1: Premium Zinc & Gold) ---
    // Sleek, neutral dark gray backgrounds with a sharp amber/gold accent
    if (mode === 'Normal') {
      root.style.setProperty('--accent-color', '#f59e0b') // amber-500
      root.style.setProperty('--accent-color-transparent', 'rgba(245, 158, 11, 0.15)')
      root.style.setProperty('--bg-primary', '#09090b') // zinc-950 (neutral black/gray)
      root.style.setProperty('--bg-secondary', '#18181b') // zinc-900 (cards)
      root.style.setProperty('--border-color', '#27272a') // zinc-800
      root.style.setProperty('--text-primary', '#fafafa') // zinc-50
      root.style.setProperty('--text-secondary', '#a1a1aa') // zinc-400
      root.style.setProperty('--glow', 'rgba(245, 158, 11, 0.2)')
      document.body.style.fontFamily = 'inherit'
    }
    // --- 2. FOCUS MODE (User Requested: Calm Deep Blue) ---
    // Calm, professional, dark blue for deep work
    else if (mode === 'Focus') {
      root.style.setProperty('--accent-color', '#3b82f6') // blue-500
      root.style.setProperty('--accent-color-transparent', 'rgba(59, 130, 246, 0.15)')
      root.style.setProperty('--bg-primary', '#020617') // slate-950 (very deep blue/black)
      root.style.setProperty('--bg-secondary', '#0f172a') // slate-900 (deep blue cards)
      root.style.setProperty('--border-color', '#1e293b') // slate-800
      root.style.setProperty('--text-primary', '#f8fafc') // slate-50
      root.style.setProperty('--text-secondary', '#94a3b8') // slate-400
      root.style.setProperty('--glow', 'rgba(59, 130, 246, 0.2)')
      document.body.style.fontFamily = 'inherit'
    } 
    // --- 3. DEADLINE MODE (From Image 2: Urgent Stone & Orange) ---
    // High alert, warm dark backgrounds with punchy vibrant orange accents
    else if (mode === 'Deadline') {
      root.style.setProperty('--accent-color', '#f97316') // orange-500
      root.style.setProperty('--accent-color-transparent', 'rgba(249, 115, 22, 0.15)')
      root.style.setProperty('--bg-primary', '#0c0a09') // stone-950 (warm dark)
      root.style.setProperty('--bg-secondary', '#1c1917') // stone-900 (warm dark cards)
      root.style.setProperty('--border-color', '#292524') // stone-800
      root.style.setProperty('--text-primary', '#fafaf9') // stone-50
      root.style.setProperty('--text-secondary', '#a8a29e') // stone-400
      root.style.setProperty('--glow', 'rgba(249, 115, 22, 0.25)')
      document.body.style.fontFamily = 'inherit'
    }
    // --- 4. HACKER MODE (Terminal Matrix) ---
    else if (mode === 'Hacker') {
      root.style.setProperty('--accent-color', '#22c55e') // green-500
      root.style.setProperty('--accent-color-transparent', 'rgba(34, 197, 94, 0.15)')
      root.style.setProperty('--bg-primary', '#000000') // Pure black
      root.style.setProperty('--bg-secondary', '#052e16') // green-950
      root.style.setProperty('--border-color', '#14532d') // green-900
      root.style.setProperty('--text-primary', '#f8fafc') 
      root.style.setProperty('--text-secondary', '#4ade80') // green-400 text
      root.style.setProperty('--glow', 'rgba(34, 197, 94, 0.3)')
      document.body.style.fontFamily = 'monospace'
    }

    // Apply the transition globally to the body
    document.body.style.backgroundColor = 'var(--bg-primary)'
    document.body.style.color = 'var(--text-primary)'
    document.body.style.transition = 'background-color 0.7s ease, color 0.7s ease'

  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}