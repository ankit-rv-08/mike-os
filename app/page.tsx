'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { MainDashboard } from '@/components/main-dashboard'
import { ThemeProvider } from '@/components/theme-provider'

export default function Home() {
  const [activeNav, setActiveNav] = useState('CORE')

  return (
    <ThemeProvider>
      <div className="h-screen flex overflow-hidden transition-colors duration-700 ease-in-out bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <MainDashboard activeNav={activeNav} />
      </div>
    </ThemeProvider>
  )
}