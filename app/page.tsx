'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { MainDashboard } from '@/components/main-dashboard'

export default function Home() {
  const [activeNav, setActiveNav] = useState('CORE')

  return (
    <div className="h-screen bg-slate-950 text-white flex overflow-hidden">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <MainDashboard activeNav={activeNav} />
    </div>
  )
}