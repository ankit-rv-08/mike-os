'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { MainDashboard } from '@/components/main-dashboard'

export default function Home() {
  const [activeNav, setActiveNav] = useState('NEURAL')

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex overflow-hidden">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <MainDashboard activeNav={activeNav} />
    </div>
  )
}